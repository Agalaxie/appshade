import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import logger from '@/lib/logger'
import fs from 'fs'
import path from 'path'

// Initialiser Prisma avec des options de reconnexion
const prisma = new PrismaClient({
  log: ['error'],
})

// Fonction pour charger les tickets temporaires depuis un fichier
function loadTemporaryTickets(): Record<string, any[]> {
  try {
    const tempFilePath = path.join(process.cwd(), 'temp-tickets.json');
    if (fs.existsSync(tempFilePath)) {
      const data = fs.readFileSync(tempFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des tickets temporaires:', error);
  }
  return {};
}

// GET /api/tickets/[id] - Récupérer un ticket par son ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`GET /api/tickets/${params.id} - Début`);
  
  // Gestion spéciale pour les tickets de démonstration
  if (params.id.startsWith('demo-')) {
    console.log(`GET /api/tickets/${params.id} - Ticket de démonstration détecté`);
    
    // Créer un ticket de démonstration avec l'ID demandé
    const demoTicket = {
      id: params.id,
      title: 'Ticket de démonstration',
      description: 'Ceci est un ticket de démonstration généré automatiquement.',
      priority: 'medium',
      status: 'in_progress',
      category: 'support',
      userId: 'demo',
      createdAt: new Date(),
      updatedAt: new Date(),
      clientName: 'Client Démo',
      user: {
        id: 'demo',
        email: 'demo@example.com',
        firstName: 'Utilisateur',
        lastName: 'Démo',
      },
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          content: 'Bonjour, j\'ai un problème avec mon compte.',
          ticketId: params.id,
          senderId: 'demo',
          senderType: 'client',
          createdAt: new Date(Date.now() - 3600000),
          read: true,
          user: {
            id: 'demo',
            email: 'demo@example.com',
            firstName: 'Utilisateur',
            lastName: 'Démo',
          }
        },
        {
          id: `msg-${Date.now()}-2`,
          content: 'Bonjour, je vais vous aider à résoudre ce problème. Pouvez-vous me donner plus de détails ?',
          ticketId: params.id,
          senderId: 'admin',
          senderType: 'admin',
          createdAt: new Date(Date.now() - 1800000),
          read: true,
          user: {
            id: 'admin',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'Support',
          }
        }
      ]
    };
    
    return NextResponse.json(demoTicket, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Demo-Data': 'true'
      }
    });
  }
  
  try {
    // Récupérer l'ID utilisateur de Clerk
    let userId;
    try {
      const authData = await auth();
      userId = authData.userId;
      
      if (!userId) {
        console.error('Utilisateur non authentifié');
        // Pour le développement, utiliser un ID utilisateur de démo
        if (process.env.NODE_ENV === 'development') {
          userId = 'demo-user';
          console.log('Utilisation de l\'ID utilisateur de démo:', userId);
        } else {
          return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }
      }
    } catch (authError) {
      console.error('Erreur d\'authentification:', authError);
      // Pour le développement, utiliser un ID utilisateur de démo
      userId = 'demo-user';
      console.log('Utilisation de l\'ID utilisateur de démo:', userId);
    }

    const { id } = params;

    // Si l'ID commence par "temp-", "error-" ou "demo-", c'est un ticket temporaire
    if (id.startsWith('temp-') || id.startsWith('error-') || id.startsWith('demo-')) {
      console.log('Ticket temporaire ou de démo détecté:', id);
      
      // Charger les tickets temporaires depuis le fichier
      const tempTickets = loadTemporaryTickets();
      
      // Rechercher le ticket spécifique dans tous les utilisateurs
      let foundTicket: any = null;
      Object.values(tempTickets).forEach((userTickets: any[]) => {
        const ticket = userTickets.find((t: any) => t.id === id);
        if (ticket) {
          foundTicket = ticket;
        }
      });
      
      if (foundTicket) {
        console.log('Ticket temporaire trouvé:', foundTicket.title);
        return NextResponse.json(foundTicket);
      }
      
      // Si le ticket n'est pas trouvé, renvoyer un ticket par défaut
      return NextResponse.json({
        id,
        title: id.startsWith('demo-') ? 'Hello world' : 'Ticket temporaire',
        description: id.startsWith('demo-') ? 'Ceci est un ticket de démonstration créé pour tester l\'application.' : 'Ce ticket est temporaire et n\'a pas encore été enregistré dans la base de données.',
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        messages: [],
      });
    }

    // Récupérer le ticket avec ses messages
    try {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true,
              phoneNumber: true,
              address: true,
              city: true,
              postalCode: true,
              country: true,
              createdAt: true,
              role: true,
            },
          },
        },
      });

      if (!ticket) {
        return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
      }

      // Vérifier que l'utilisateur est autorisé à voir ce ticket
      if (ticket.userId !== userId) {
        logger.info(`Vérification des permissions pour l'utilisateur ${userId} sur le ticket ${id}`);
        
        // Récupérer l'utilisateur depuis Clerk
        const clerkUser = await currentUser();
        logger.info(`Métadonnées Clerk:`, clerkUser?.publicMetadata);
        
        // Vérifier si l'utilisateur est un admin dans la base de données
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });
        
        logger.info(`Rôle dans la base de données:`, user?.role);

        const isAdmin = user?.role === 'admin';
        
        if (!isAdmin) {
          logger.warn(`Accès refusé pour l'utilisateur ${userId} (rôle: ${user?.role})`);
          return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }
        
        logger.info(`Accès autorisé pour l'administrateur ${userId}`);
      }

      return NextResponse.json(ticket);
    } catch (dbError) {
      console.error('Erreur lors de la récupération du ticket:', dbError);
      
      // En cas d'erreur de base de données, renvoyer un ticket factice
      return NextResponse.json({
        id,
        title: 'Ticket temporaire',
        description: 'Impossible de récupérer les détails du ticket pour le moment.',
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        messages: [],
      });
    }
  } catch (error) {
    console.error('Erreur globale lors de la récupération du ticket:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/tickets/[id] - Supprimer un ticket
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`DELETE /api/tickets/${params.id} - Début de la suppression`);
  
  // Vérifier que l'ID du ticket est valide
  if (!params.id || typeof params.id !== 'string' || params.id.trim() === '') {
    console.log(`DELETE /api/tickets/${params.id} - ID de ticket invalide`);
    return NextResponse.json(
      { error: 'ID de ticket invalide' },
      { status: 400 }
    );
  }

  // Gestion spéciale pour les tickets de démonstration
  if (params.id.startsWith('demo-')) {
    console.log(`DELETE /api/tickets/${params.id} - Ticket de démonstration détecté, simulation de suppression`);
    return NextResponse.json(
      { success: true, message: 'Ticket de démonstration supprimé avec succès' },
      { status: 200 }
    );
  }

  try {
    // Vérifier la connexion à la base de données
    try {
      console.log(`DELETE /api/tickets/${params.id} - Vérification de la connexion à la base de données`);
      await prisma.$queryRaw`SELECT 1`;
      console.log(`DELETE /api/tickets/${params.id} - Connexion à la base de données OK`);
    } catch (dbError) {
      console.error(`DELETE /api/tickets/${params.id} - Erreur de connexion à la base de données:`, dbError);
      return NextResponse.json(
        { error: 'Erreur de connexion à la base de données' },
        { status: 500 }
      );
    }

    // Vérifier l'authentification
    const { userId } = auth();
    console.log(`DELETE /api/tickets/${params.id} - Utilisateur authentifié: ${userId}`);

    if (!userId) {
      console.log(`DELETE /api/tickets/${params.id} - Utilisateur non authentifié`);
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est admin
    let isAdmin = false;
    try {
      console.log(`DELETE /api/tickets/${params.id} - Vérification du rôle de l'utilisateur`);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
      isAdmin = user?.role === 'admin';
      console.log(`DELETE /api/tickets/${params.id} - Utilisateur est admin: ${isAdmin}`);
    } catch (error) {
      console.error(`DELETE /api/tickets/${params.id} - Erreur lors de la vérification du rôle:`, error);
      // En cas d'erreur, on suppose que l'utilisateur n'est pas admin
      isAdmin = false;
    }

    // Récupérer le ticket pour vérifier les permissions
    console.log(`DELETE /api/tickets/${params.id} - Récupération du ticket`);
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!ticket) {
      console.log(`DELETE /api/tickets/${params.id} - Ticket non trouvé`);
      return NextResponse.json(
        { error: 'Ticket non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les permissions (seul le propriétaire ou un admin peut supprimer)
    if (ticket.userId !== userId && !isAdmin) {
      console.log(`DELETE /api/tickets/${params.id} - Permission refusée`);
      return NextResponse.json(
        { error: 'Permission refusée' },
        { status: 403 }
      );
    }

    // Utiliser une transaction pour supprimer le ticket et ses relations
    console.log(`DELETE /api/tickets/${params.id} - Début de la transaction de suppression`);
    await prisma.$transaction(async (tx) => {
      // 1. Supprimer les réactions aux messages du ticket
      console.log(`DELETE /api/tickets/${params.id} - Suppression des réactions`);
      await tx.messageReaction.deleteMany({
        where: {
          message: {
            ticketId: params.id
          }
        }
      });

      // 2. Supprimer les pièces jointes du ticket
      console.log(`DELETE /api/tickets/${params.id} - Suppression des pièces jointes`);
      await tx.attachment.deleteMany({
        where: {
          ticketId: params.id
        }
      });

      // 3. Supprimer les messages du ticket
      console.log(`DELETE /api/tickets/${params.id} - Suppression des messages`);
      await tx.message.deleteMany({
        where: {
          ticketId: params.id
        }
      });

      // 4. Enfin, supprimer le ticket lui-même
      console.log(`DELETE /api/tickets/${params.id} - Suppression du ticket`);
      await tx.ticket.delete({
        where: {
          id: params.id
        }
      });
    });

    console.log(`DELETE /api/tickets/${params.id} - Suppression réussie`);
    return NextResponse.json(
      { success: true, message: 'Ticket supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /api/tickets/${params.id} - Erreur lors de la suppression:`, error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du ticket', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/tickets/[id] - Mettre à jour un ticket
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`PATCH /api/tickets/${params.id} - Début`);
  
  // Gestion spéciale pour les tickets de démonstration
  if (params.id.startsWith('demo-')) {
    console.log(`PATCH /api/tickets/${params.id} - Ticket de démonstration détecté, simulation de mise à jour`);
    
    try {
      // Récupérer les données de la requête
      const data = await req.json();
      console.log(`PATCH /api/tickets/${params.id} - Données reçues:`, data);
      
      // Simuler une mise à jour réussie
      return NextResponse.json(
        { 
          success: true, 
          message: 'Ticket de démonstration mis à jour avec succès',
          data: {
            id: params.id,
            ...data
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(`PATCH /api/tickets/${params.id} - Erreur lors du parsing des données:`, error);
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }
  }
  
  try {
    // Récupérer l'ID utilisateur de Clerk
    let userId;
    try {
      const authData = await auth();
      userId = authData.userId;
      
      if (!userId) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
    } catch (authError) {
      console.error('Erreur d\'authentification:', authError);
      // Pour le développement, utiliser un ID utilisateur de démo
      userId = 'demo-user';
      console.log('Utilisation de l\'ID utilisateur de démo pour PATCH:', userId);
    }

    const { id } = params;
    const data = await req.json();
    
    // Si l'ID commence par "demo-", "temp-" ou "error-", simuler une mise à jour réussie
    if (id.startsWith('temp-') || id.startsWith('error-') || id.startsWith('demo-')) {
      return NextResponse.json({
        ...data,
        id,
        updatedAt: new Date().toISOString(),
      });
    }

    // Vérifier que le ticket existe
    try {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });

      if (!ticket) {
        return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
      }

      // Vérifier que l'utilisateur est autorisé à modifier ce ticket
      if (ticket.userId !== userId) {
        // Vérifier si l'utilisateur est un admin
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });

        const isAdmin = user?.role === 'admin';

        if (!isAdmin) {
          return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }
      }

      // Mettre à jour le ticket
      const updatedTicket = await prisma.ticket.update({
        where: {
          id,
        },
        data: {
          status: data.status,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(updatedTicket);
    } catch (dbError) {
      console.error('Erreur lors de la mise à jour du ticket:', dbError);
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur globale lors de la mise à jour du ticket:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 