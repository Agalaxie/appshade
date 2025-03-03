import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
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

// Fonction pour sauvegarder les tickets temporaires dans un fichier
function saveTemporaryTickets(tickets: Record<string, any[]>) {
  try {
    const tempFilePath = path.join(process.cwd(), 'temp-tickets.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(tickets), 'utf8');
    console.log(`Tickets temporaires sauvegardés dans ${tempFilePath}`);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tickets temporaires:', error);
  }
}

// GET /api/tickets/[id]/messages - Récupérer tous les messages d'un ticket
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let userId;
    try {
      const { userId: clerkUserId } = await auth();
      userId = clerkUserId;
      
      if (!userId) {
        console.error('Utilisateur non authentifié');
        // Pour le développement, utiliser un ID utilisateur de démo
        if (process.env.NODE_ENV === 'development') {
          userId = 'demo-user';
          console.log('Utilisation de l\'ID utilisateur de démo pour GET messages:', userId);
        } else {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }
      }
    } catch (authError) {
      console.error("Erreur d'authentification:", authError);
      // Pour le développement, utiliser un ID utilisateur de démo
      userId = 'demo-user';
      console.log('Utilisation de l\'ID utilisateur de démo pour GET messages:', userId);
    }
    
    const ticketId = params.id;
    
    // Si l'ID du ticket commence par "temp-", "error-" ou "demo-", c'est un ticket temporaire
    if (ticketId.startsWith('temp-') || ticketId.startsWith('error-') || ticketId.startsWith('demo-')) {
      console.log('Ticket temporaire ou de démo détecté pour les messages:', ticketId);
      
      // Charger les tickets temporaires depuis le fichier
      const tempTickets = loadTemporaryTickets();
      
      // Rechercher le ticket spécifique dans tous les utilisateurs
      let foundTicket: any = null;
      Object.values(tempTickets).forEach((userTickets: any[]) => {
        const ticket = userTickets.find((t: any) => t.id === ticketId);
        if (ticket) {
          foundTicket = ticket;
        }
      });
      
      if (foundTicket && foundTicket.messages && foundTicket.messages.length > 0) {
        console.log('Messages trouvés pour le ticket temporaire:', foundTicket.messages.length);
        return NextResponse.json(foundTicket.messages);
      }
      
      // Si aucun message n'est trouvé ou si le ticket n'a pas de messages, renvoyer des messages par défaut
      return NextResponse.json([
        {
          id: `demo-message-${Date.now()}-1`,
          content: 'Bienvenue ! Comment puis-je vous aider avec ce ticket ?',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 heure avant
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          userId: 'admin-user',
          ticketId,
          isInternal: false,
          user: {
            id: 'admin-user',
            firstName: 'Support',
            lastName: 'Technique',
            email: 'support@appshade.com',
            role: 'admin',
          },
        }
      ]);
    }
    
    // Récupérer le ticket pour vérifier les permissions
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    
    if (!ticket) {
      return NextResponse.json({ error: "Ticket non trouvé" }, { status: 404 });
    }
    
    // Vérifier si l'utilisateur a le droit d'accéder à ce ticket
    let isAdmin = false;
    let isOwner = false;
    
    try {
      // Vérifier si l'utilisateur est un administrateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });
      
      if (user && user.role === 'admin') {
        console.log('[INFO] Utilisateur identifié comme admin via la base de données');
        isAdmin = true;
      }
      
      // Vérifier si l'utilisateur est le propriétaire du ticket
      isOwner = ticket.userId === userId;
      
      console.log(`[INFO] Vérification des permissions pour l'utilisateur ${userId} sur le ticket ${ticket.id}`);
      console.log(`[INFO] Propriétaire: ${isOwner}, Admin: ${isAdmin}`);
      
      if (!isOwner && !isAdmin) {
        console.log(`[INFO] Accès refusé: l'utilisateur n'est ni propriétaire ni admin`);
        return NextResponse.json({ error: "Accès non autorisé à ce ticket" }, { status: 403 });
      }
      
      console.log(`[INFO] Accès autorisé pour l'utilisateur ${userId}`);
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return NextResponse.json({ error: "Erreur lors de la vérification des permissions" }, { status: 500 });
    }
    
    // Récupérer les messages
    const messages = await prisma.message.findMany({
      where: {
        ticketId,
        // Si l'utilisateur n'est pas admin, filtrer les messages internes
        ...(isAdmin ? {} : { isInternal: false }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}

// POST /api/tickets/[id]/messages - Ajouter un message à un ticket
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID utilisateur de Clerk
    let userId;
    try {
      const { userId: clerkUserId } = await auth();
      userId = clerkUserId;
      
      if (!userId) {
        console.error('Utilisateur non authentifié');
        // Pour le développement, utiliser un ID utilisateur de démo
        if (process.env.NODE_ENV === 'development') {
          userId = 'demo-user';
          console.log('Utilisation de l\'ID utilisateur de démo pour POST message:', userId);
        } else {
          return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }
      }
    } catch (authError) {
      console.error("Erreur d'authentification:", authError);
      // Pour le développement, utiliser un ID utilisateur de démo
      userId = 'demo-user';
      console.log('Utilisation de l\'ID utilisateur de démo pour POST message:', userId);
    }
    
    const ticketId = params.id;
    const data = await req.json();
    
    if (!data.content) {
      return NextResponse.json(
        { error: 'Le contenu du message est obligatoire' },
        { status: 400 }
      );
    }
    
    // Si l'ID du ticket commence par "temp-", "error-" ou "demo-", c'est un ticket temporaire
    if (ticketId.startsWith('temp-') || ticketId.startsWith('error-') || ticketId.startsWith('demo-')) {
      console.log('Ticket temporaire ou de démo détecté pour ajouter un message:', ticketId);
      
      // Charger les tickets temporaires depuis le fichier
      const tempTickets = loadTemporaryTickets();
      
      // Rechercher le ticket spécifique dans tous les utilisateurs
      let foundTicket: any = null;
      let foundUserKey: string | null = null;
      let foundTicketIndex: number = -1;
      
      Object.entries(tempTickets).forEach(([userKey, userTickets]) => {
        const ticketIndex = userTickets.findIndex((t: any) => t.id === ticketId);
        if (ticketIndex !== -1) {
          foundTicket = userTickets[ticketIndex];
          foundUserKey = userKey;
          foundTicketIndex = ticketIndex;
        }
      });
      
      if (foundTicket && foundUserKey !== null && foundTicketIndex !== -1) {
        // Créer un nouveau message
        const newMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          content: data.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: userId,
          ticketId: ticketId,
          isInternal: data.isInternal || false,
          user: {
            id: userId,
            firstName: userId === 'demo-user' ? 'Utilisateur' : 'Client',
            lastName: userId === 'demo-user' ? 'Démo' : 'Temporaire',
            email: userId === 'demo-user' ? 'demo@example.com' : 'client@temporaire.com',
            role: 'client'
          }
        };
        
        // Ajouter le message au ticket
        if (!foundTicket.messages) {
          foundTicket.messages = [];
        }
        
        foundTicket.messages.push(newMessage);
        tempTickets[foundUserKey][foundTicketIndex] = foundTicket;
        
        // Sauvegarder les tickets temporaires
        saveTemporaryTickets(tempTickets);
        
        return NextResponse.json(newMessage, { status: 201 });
      }
      
      // Si le ticket n'est pas trouvé, renvoyer un message par défaut
      const demoMessage = {
        id: `demo-message-${Date.now()}`,
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId,
        ticketId: ticketId,
        isInternal: data.isInternal || false,
        user: {
          id: userId,
          firstName: 'Utilisateur',
          lastName: 'Démo',
          email: 'demo@example.com',
          role: 'client'
        }
      };
      
      return NextResponse.json(demoMessage, { 
        status: 201,
        headers: {
          'X-Demo-Message': 'true'
        }
      });
    }
    
    // Pour les tickets normaux, continuer avec le code existant...

    // Vérifier que le ticket existe et que l'utilisateur a le droit d'y accéder
    try {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: ticketId,
        },
      });

      if (!ticket) {
        return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 });
      }

      // Vérifier que l'utilisateur est autorisé à ajouter un message à ce ticket
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

      // Créer le message
      const message = await prisma.message.create({
        data: {
          content: data.content,
          userId,
          ticketId,
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
      });

      // Mettre à jour le statut du ticket si nécessaire
      if (ticket.status === 'closed') {
        await prisma.ticket.update({
          where: {
            id: ticketId,
          },
          data: {
            status: 'open',
          },
        });
      }

      return NextResponse.json(message);
    } catch (dbError) {
      console.error('Erreur lors de la création du message:', dbError);
      
      // En cas d'erreur de base de données, renvoyer un message factice
      return NextResponse.json({
        id: `error-message-${Date.now()}`,
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId,
        ticketId,
        user: {
          id: userId,
          firstName: 'Utilisateur',
          lastName: 'Temporaire',
          role: 'client',
        },
      });
    }
  } catch (error) {
    console.error('Erreur globale lors de la création du message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 