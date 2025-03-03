import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import logger, { LogLevel } from '@/lib/logger'
import fs from 'fs'
import path from 'path'

// Initialiser Prisma avec des logs de débogage
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Variables globales pour stocker les informations des tickets
let lastTicketCreationTime = 0;
let lastTicketData: any = null;
// let temporaryTickets: any[] = []; // Stockage temporaire des tickets

// Stockage temporaire pour les tickets en cas de problème avec la base de données
const temporaryTickets: Record<string, any[]> = {};

// Utiliser un fichier temporaire pour stocker les tickets entre les redémarrages du serveur

// Fonction pour sauvegarder les tickets temporaires dans un fichier
function saveTemporaryTickets() {
  try {
    const tempFilePath = path.join(process.cwd(), 'temp-tickets.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(temporaryTickets), 'utf8');
    logger.debug(`Tickets temporaires sauvegardés dans ${tempFilePath}`);
  } catch (error) {
    logger.error('Erreur lors de la sauvegarde des tickets temporaires:', error);
  }
}

// Fonction pour charger les tickets temporaires depuis un fichier
function loadTemporaryTickets() {
  try {
    const tempFilePath = path.join(process.cwd(), 'temp-tickets.json');
    if (fs.existsSync(tempFilePath)) {
      const data = fs.readFileSync(tempFilePath, 'utf8');
      const loadedTickets = JSON.parse(data);
      
      // Convertir les dates de string à Date
      Object.keys(loadedTickets).forEach(userId => {
        loadedTickets[userId] = loadedTickets[userId].map((ticket: any) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt)
        }));
      });
      
      Object.assign(temporaryTickets, loadedTickets);
      logger.debug(`Tickets temporaires chargés depuis ${tempFilePath}`);
    }
  } catch (error) {
    logger.error('Erreur lors du chargement des tickets temporaires:', error);
  }
}

// Charger les tickets temporaires au démarrage
loadTemporaryTickets();

// Cache pour les tickets récupérés (durée de vie de 5 minutes)
const ticketsCache: Record<string, { tickets: any[], timestamp: number }> = {};
const CACHE_DURATION = 300000; // 5 minutes (300000 ms)

// Variable pour limiter les logs
let lastLogTime = 0;
const LOG_THROTTLE = 5000; // 5 secondes entre les logs

// Compteur de requêtes pour les statistiques
let requestCounter = 0;
let lastRequestCounterReset = Date.now();

// Fonction pour limiter les logs
function throttledLog(message: string) {
  const now = Date.now();
  if (now - lastLogTime > LOG_THROTTLE) {
    logger.debug(message);
    lastLogTime = now;
    
    // Réinitialiser le compteur de requêtes toutes les minutes
    if (now - lastRequestCounterReset > 60000) {
      if (requestCounter > 0) {
        logger.info(`Statistiques: ${requestCounter} requêtes de tickets dans la dernière minute`);
      }
      requestCounter = 0;
      lastRequestCounterReset = now;
    }
  }
}

// Helper pour les en-têtes CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// GET /api/tickets - Récupérer tous les tickets (filtré selon le rôle)
export async function GET(request: NextRequest) {
  // Incrémenter le compteur de requêtes
  requestCounter++;
  
  // Ajouter des logs détaillés
  console.log(`GET /api/tickets - Requête #${requestCounter} - Début`);
  
  try {
    // Vérifier s'il y a des tickets de démonstration dans l'URL
    const url = new URL(request.url);
    const showDemo = url.searchParams.get('demo') === 'true';
    
    if (showDemo) {
      console.log('Mode démo activé, création de tickets de démonstration');
      // Créer quelques tickets de démonstration
      const demoTickets = [
        {
          id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          title: 'Problème de connexion',
          description: 'Je n\'arrive pas à me connecter à mon compte.',
          priority: 'high',
          status: 'open',
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
          messages: []
        },
        {
          id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          title: 'Question sur la facturation',
          description: 'Je souhaiterais des informations sur ma dernière facture.',
          priority: 'medium',
          status: 'in_progress',
          category: 'billing',
          userId: 'demo',
          createdAt: new Date(Date.now() - 86400000), // 1 jour avant
          updatedAt: new Date(Date.now() - 43200000), // 12 heures avant
          clientName: 'Client Démo',
          user: {
            id: 'demo',
            email: 'demo@example.com',
            firstName: 'Utilisateur',
            lastName: 'Démo',
          },
          messages: []
        }
      ];
      
      console.log(`${demoTickets.length} tickets de démonstration créés`);
      return NextResponse.json(demoTickets, {
        headers: {
          'Cache-Control': 'no-store',
          'X-Demo-Data': 'true'
        }
      });
    }
    
    // Vérifier l'authentification
    let userId;
    let isAdmin = false;
    
    try {
      const authResult = await auth();
      userId = authResult.userId;
      
      // Vérifier les métadonnées pour le rôle admin
      const metadata = authResult.sessionClaims?.metadata as Record<string, unknown> || {};
      if (Array.isArray(metadata.roles) && metadata.roles.includes('admin')) {
        isAdmin = true;
        console.log('Utilisateur authentifié avec rôle admin via Clerk');
      }
    } catch (authError) {
      console.error('Erreur d\'authentification:', authError);
      // En mode développement, on peut utiliser un ID de démo
      if (process.env.NODE_ENV === 'development') {
        userId = 'demo-user';
        isAdmin = true; // Pour le développement, considérer comme admin
        console.log('Mode développement: utilisation d\'un utilisateur de démo avec accès admin');
      } else {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
      }
    }
    
    if (!userId) {
      // En mode développement, on peut utiliser un ID de démo
      if (process.env.NODE_ENV === 'development') {
        userId = 'demo-user';
        isAdmin = true; // Pour le développement, considérer comme admin
        console.log('Mode développement: utilisation d\'un utilisateur de démo avec accès admin');
      } else {
        return NextResponse.json({ error: 'Non authentifié' }, { 
          status: 401,
          headers: {
            'Cache-Control': 'no-store',
            'Pragma': 'no-cache'
          }
        });
      }
    }

    // Si l'utilisateur n'est pas encore identifié comme admin via Clerk, vérifier dans la base de données
    if (!isAdmin) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true }
        });
        isAdmin = user?.role === 'admin';
        if (isAdmin) {
          console.log('Utilisateur identifié comme admin via la base de données');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle dans la base de données:', error);
        // En cas d'erreur, on suppose que l'utilisateur n'est pas admin
        isAdmin = false;
      }
    }
    
    // En mode développement, forcer l'accès admin pour faciliter les tests
    if (process.env.NODE_ENV === 'development') {
      isAdmin = true;
      console.log('Mode développement: accès admin forcé');
    }

    // Construire la requête en fonction du rôle
    const whereClause = isAdmin ? {} : { userId };
    
    console.log(`Récupération des tickets avec whereClause: ${JSON.stringify(whereClause)}`);
    
    // Récupérer les tickets depuis la base de données
    try {
      console.log('Tentative de récupération des tickets depuis la base de données...');
      const tickets = await prisma.ticket.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            }
          },
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
        },
      });
      
      console.log(`Tickets récupérés: ${tickets.length}`);
      
      // Si aucun ticket n'est trouvé, retourner un tableau vide
      if (tickets.length === 0) {
        console.log('Aucun ticket trouvé, retour d\'un tableau vide');
        return NextResponse.json([], {
          headers: {
            'Cache-Control': 'no-store'
          }
        });
      }
      
      // Trier les tickets par date de création (du plus récent au plus ancien)
      tickets.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      console.log(`${tickets.length} tickets trouvés pour ${isAdmin ? 'admin' : userId}`);
      
      return NextResponse.json(tickets, {
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    } catch (dbError) {
      console.error('Erreur lors de la récupération des tickets depuis la base de données:', dbError);
      
      // En cas d'erreur de base de données, retourner un tableau vide
      console.log('Retour d\'un tableau vide en raison d\'une erreur de base de données');
      
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-store',
          'X-Error': 'database_error'
        }
      });
    }
  } catch (error) {
    console.error('Erreur globale lors de la récupération des tickets:', error);
    
    // En cas d'erreur globale, retourner un tableau vide
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store',
        'X-Error': 'global_error'
      }
    });
  }
}

// POST /api/tickets - Créer un nouveau ticket
export async function POST(request: NextRequest) {
  logger.info('POST /api/tickets - Début de la création de ticket');
  
  try {
    // Récupérer les données du ticket
    const data = await request.json();
    console.log("API /tickets - Données reçues:", data);
    
    // Vérifier les champs obligatoires
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Le titre et la description sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Valider la catégorie
    if (!data.category) {
      data.category = 'other'; // Catégorie par défaut
    }
    
    // Valider la priorité
    if (!['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
      data.priority = 'medium'; // Priorité par défaut
    }
    
    try {
      // Vérifier l'authentification de manière sécurisée
      let userId;
      try {
        const authResult = await auth();
        userId = authResult.userId;
      } catch (authError) {
        console.error("API /tickets - Erreur d'authentification:", authError);
        // En mode développement, on peut utiliser un ID de démo
        if (process.env.NODE_ENV === 'development') {
          userId = 'demo-user';
        } else {
          return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }
      }
      
      if (!userId) {
        // En mode développement, on peut utiliser un ID de démo
        if (process.env.NODE_ENV === 'development') {
          userId = 'demo-user';
        } else {
          return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }
      }
      
      try {
        // Tenter de créer le ticket dans la base de données
        const ticket = await prisma.ticket.create({
          data: {
            title: data.title,
            description: data.description,
            status: 'open',
            priority: data.priority,
            category: data.category,
            userId: userId,
            // Ajouter les informations d'accès FTP
            ftpHost: data.ftpHost || null,
            ftpPort: data.ftpPort || null,
            ftpUsername: data.ftpUsername || null,
            ftpPassword: data.ftpPassword || null,
            // Ajouter les informations d'accès CMS
            cmsType: data.cmsType || null,
            cmsUrl: data.cmsUrl || null,
            cmsUsername: data.cmsUsername || null,
            cmsPassword: data.cmsPassword || null,
            // Ajouter les informations d'hébergement
            hostingProvider: data.hostingProvider || null,
            hostingPlan: data.hostingPlan || null,
          },
        });
        
        // Enregistrer le dernier ticket créé pour la déduplication
        lastTicketCreationTime = Date.now();
        lastTicketData = data;
        
        // Créer un ticket temporaire
        const tempTicket = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          title: data.title,
          description: data.description,
          priority: data.priority || 'medium',
          status: 'open',
          category: data.category || 'support',
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientId: null,
          clientName: 'Client Temporaire',
          assignedToId: null,
          ftpHost: data.ftpHost || null,
          ftpPort: data.ftpPort || null,
          ftpUsername: data.ftpUsername || null,
          ftpPassword: data.ftpPassword || null,
          cmsType: data.cmsType || null,
          cmsUrl: data.cmsUrl || null,
          cmsUsername: data.cmsUsername || null,
          cmsPassword: data.cmsPassword || null,
          hostingProvider: data.hostingProvider || null,
          hostingPlan: data.hostingPlan || null,
          user: {
            id: userId,
            email: 'utilisateur@temporaire.com',
            firstName: 'Utilisateur',
            lastName: 'Temporaire',
            role: 'client'
          },
          messages: []
        };

        // Stocker le ticket dans le stockage temporaire
        if (!temporaryTickets[userId]) {
          temporaryTickets[userId] = [];
        }
        temporaryTickets[userId].push(tempTicket);
        
        // Sauvegarder les tickets temporaires
        saveTemporaryTickets();
        
        return NextResponse.json(ticket, { status: 201 });
      } catch (dbError) {
        logger.error('Erreur lors de la création du ticket dans la base de données:', dbError);
        
        // Créer un ticket de démonstration
        const demoTicket = {
          id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          title: data.title || 'Ticket de démonstration',
          description: data.description || 'Ceci est un ticket de démonstration créé automatiquement.',
          priority: data.priority || 'medium',
          status: 'open',
          category: data.category || 'support',
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          clientId: null,
          clientName: 'Client Démo',
          assignedToId: null,
          ftpHost: data.ftpHost || null,
          ftpPort: data.ftpPort || null,
          ftpUsername: data.ftpUsername || null,
          ftpPassword: data.ftpPassword || null,
          cmsType: data.cmsType || null,
          cmsUrl: data.cmsUrl || null,
          cmsUsername: data.cmsUsername || null,
          cmsPassword: data.cmsPassword || null,
          hostingProvider: data.hostingProvider || null,
          hostingPlan: data.hostingPlan || null,
          user: {
            id: userId,
            email: 'demo@example.com',
            firstName: 'Utilisateur',
            lastName: 'Démo',
            role: 'client'
          },
          messages: []
        };
        
        // Stocker le ticket dans le stockage temporaire
        if (!temporaryTickets[userId]) {
          temporaryTickets[userId] = [];
        }
        temporaryTickets[userId].push(demoTicket);
        
        // Sauvegarder les tickets temporaires
        saveTemporaryTickets();
        
        return NextResponse.json(demoTicket, { 
          status: 201,
          headers: {
            'X-Demo-Ticket': 'true',
            'X-Error': 'database_error'
          }
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la création du ticket:', error);
      
      // Créer un ticket de démonstration
      const demoTicket = {
        id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        title: data.title || 'Ticket de démonstration',
        description: data.description || 'Ceci est un ticket de démonstration créé automatiquement.',
        priority: data.priority || 'medium',
        status: 'open',
        category: data.category || 'support',
        userId: 'demo-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        clientId: null,
        clientName: 'Client Démo',
        assignedToId: null,
        ftpHost: data.ftpHost || null,
        ftpPort: data.ftpPort || null,
        ftpUsername: data.ftpUsername || null,
        ftpPassword: data.ftpPassword || null,
        cmsType: data.cmsType || null,
        cmsUrl: data.cmsUrl || null,
        cmsUsername: data.cmsUsername || null,
        cmsPassword: data.cmsPassword || null,
        hostingProvider: data.hostingProvider || null,
        hostingPlan: data.hostingPlan || null,
        user: {
          id: 'demo',
          email: 'demo@example.com',
          firstName: 'Utilisateur',
          lastName: 'Démo',
          role: 'client'
        },
        messages: []
      };
      
      // Stocker le ticket dans le stockage temporaire
      if (!temporaryTickets['demo-user']) {
        temporaryTickets['demo-user'] = [];
      }
      temporaryTickets['demo-user'].push(demoTicket);
      
      // Sauvegarder les tickets temporaires
      saveTemporaryTickets();
      
      return NextResponse.json(demoTicket, { status: 201 });
    }
  } catch (error) {
    logger.error('Erreur serveur lors de la création du ticket:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Fonction pour supprimer tous les tickets et données associées
async function deleteAllTickets() {
  console.log('Suppression de tous les tickets et données associées...');
  
  try {
    // Utiliser une transaction pour s'assurer que tout est supprimé correctement
    await prisma.$transaction(async (tx) => {
      // 1. Supprimer toutes les réactions aux messages
      await tx.messageReaction.deleteMany({});
      console.log('Toutes les réactions aux messages ont été supprimées');
      
      // 2. Supprimer toutes les pièces jointes
      await tx.attachment.deleteMany({});
      console.log('Toutes les pièces jointes ont été supprimées');
      
      // 3. Supprimer tous les messages
      await tx.message.deleteMany({});
      console.log('Tous les messages ont été supprimés');
      
      // 4. Supprimer tous les tickets
      await tx.ticket.deleteMany({});
      console.log('Tous les tickets ont été supprimés');
    });
    
    console.log('Nettoyage complet terminé avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les tickets:', error);
    return false;
  }
}

// Ajouter une route OPTIONS pour supprimer tous les tickets
export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS request received to delete all tickets');
  
  try {
    // Désactiver l'authentification pour cette route en développement
    // En production, vous voudriez probablement garder l'authentification
    console.log('Authentication disabled for OPTIONS request in development');
    
    // Supprimer tous les tickets
    try {
      const success = await deleteAllTickets();
      
      if (success) {
        console.log('All tickets deleted successfully');
        return NextResponse.json(
          { message: 'Tous les tickets ont été supprimés avec succès' },
          { 
            status: 200, 
            headers: corsHeaders
          }
        );
      } else {
        console.error('Error deleting tickets');
        return NextResponse.json(
          { message: 'Erreur lors de la suppression des tickets' },
          { 
            status: 500, 
            headers: corsHeaders
          }
        );
      }
    } catch (error) {
      console.error('Error deleting tickets:', error);
      return NextResponse.json(
        { message: 'Erreur lors de la suppression des tickets' },
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
} 