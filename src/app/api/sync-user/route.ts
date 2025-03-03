import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import logger from "@/lib/logger";

// Variable pour suivre les synchronisations récentes par utilisateur
const recentSyncs: Record<string, number> = {};
const SYNC_COOLDOWN = 5000; // 5 secondes entre les synchronisations

// Cache des utilisateurs pour éviter les requêtes répétées à la base de données
const userCache: Record<string, { user: any, timestamp: number }> = {};
const USER_CACHE_DURATION = 300000; // 5 minutes de cache

// POST /api/sync-user - Synchroniser un utilisateur Clerk avec notre base de données
export async function POST(request: Request) {
  try {
    // Récupérer l'ID utilisateur depuis Clerk
    const { userId } = await auth();
    
    if (!userId) {
      logger.error("Synchronisation: Utilisateur non authentifié");
      return NextResponse.json({ error: "Non autorisé" }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      });
    }
    
    // Récupérer les métadonnées de l'utilisateur depuis Clerk
    const clerkUser = await currentUser();
    const role = ((clerkUser?.publicMetadata?.role as string) || 'client');
    
    // Vérifier si cet utilisateur a été synchronisé récemment
    const now = Date.now();
    if (recentSyncs[userId] && now - recentSyncs[userId] < SYNC_COOLDOWN) {
      logger.debug(`Synchronisation ignorée pour ${userId} - Trop récente (${Math.round((now - recentSyncs[userId])/1000)}s)`);
      
      // Vérifier si l'utilisateur est en cache
      if (userCache[userId] && now - userCache[userId].timestamp < USER_CACHE_DURATION) {
        logger.debug(`Utilisateur récupéré du cache: ${userId}`);
        return NextResponse.json(userCache[userId].user, {
          headers: {
            'Cache-Control': 'private, max-age=300',
            'X-Cache-Hit': 'true'
          }
        });
      }
      
      // Récupérer l'utilisateur depuis la base de données sans créer de nouvelle entrée
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (existingUser) {
        // Mettre à jour le rôle si nécessaire
        if (existingUser.role !== role) {
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role }
          });
          logger.info(`Rôle mis à jour pour l'utilisateur ${userId}: ${role}`);
        }
        
        // Mettre en cache l'utilisateur
        userCache[userId] = { user: existingUser, timestamp: now };
        
        return NextResponse.json(existingUser, {
          headers: {
            'Cache-Control': 'private, max-age=300',
            'X-Cache-Hit': 'false'
          }
        });
      }
    }
    
    // Marquer cet utilisateur comme récemment synchronisé
    recentSyncs[userId] = now;
    
    logger.info("Synchronisation: Utilisateur authentifié", userId);
    
    // Créer un objet utilisateur par défaut (au cas où la base de données échoue)
    const defaultUser = {
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@example.com`,
      firstName: clerkUser?.firstName || "Utilisateur",
      lastName: clerkUser?.lastName || "Temporaire",
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Essayer d'accéder à la base de données, mais retourner l'utilisateur par défaut en cas d'erreur
    try {
      // Vérifier si l'utilisateur existe déjà dans notre base de données
      let user = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (user) {
        // Mettre à jour le rôle si nécessaire
        if (user.role !== role) {
          user = await prisma.user.update({
            where: { id: userId },
            data: { role }
          });
          logger.info(`Rôle mis à jour pour l'utilisateur ${userId}: ${role}`);
        }
        
        logger.debug("Utilisateur existant trouvé dans la base de données:", user.id);
        
        // Mettre en cache l'utilisateur
        userCache[userId] = { user, timestamp: now };
        
        return NextResponse.json(user, {
          headers: {
            'Cache-Control': 'private, max-age=300',
            'X-Cache-Hit': 'false'
          }
        });
      }
      
      // L'utilisateur n'existe pas, le créer avec les données de Clerk
      logger.info("Création d'un nouvel utilisateur avec ID:", userId);
      
      user = await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@example.com`,
          firstName: clerkUser?.firstName || "Utilisateur",
          lastName: clerkUser?.lastName || "Temporaire",
          role: role,
        },
      });
      
      logger.info("Nouvel utilisateur créé avec succès:", user);
      
      // Mettre en cache l'utilisateur
      userCache[userId] = { user, timestamp: now };
      
      return NextResponse.json(user, {
        headers: {
          'Cache-Control': 'private, max-age=300',
          'X-Cache-Hit': 'false'
        }
      });
    } catch (dbError) {
      logger.error("Erreur de base de données lors de la création de l'utilisateur:", dbError);
      // Retourner l'utilisateur par défaut même en cas d'erreur de base de données
      // Cela permettra à l'application de continuer à fonctionner
      logger.warn("Retour d'un utilisateur par défaut en raison d'une erreur de base de données");
      return NextResponse.json(defaultUser, {
        headers: {
          'Cache-Control': 'no-store',
          'X-Error': 'database_error'
        }
      });
    }
  } catch (error) {
    logger.error("Erreur globale lors de la synchronisation de l'utilisateur:", error);
    // Créer un utilisateur par défaut même en cas d'erreur globale
    const defaultUser = {
      id: "unknown",
      email: "unknown@example.com",
      firstName: "Utilisateur",
      lastName: "Temporaire",
      role: "client",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return NextResponse.json(defaultUser, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Error': 'global_error'
      }
    });
  }
}

// GET /api/sync-user - Récupérer les informations de l'utilisateur actuel
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { 
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      });
    }
    
    const now = Date.now();
    
    // Vérifier si l'utilisateur est en cache
    if (userCache[userId] && now - userCache[userId].timestamp < USER_CACHE_DURATION) {
      logger.debug(`Utilisateur récupéré du cache: ${userId}`);
      return NextResponse.json(userCache[userId].user, {
        headers: {
          'Cache-Control': 'private, max-age=300',
          'X-Cache-Hit': 'true'
        }
      });
    }
    
    // Créer un objet utilisateur par défaut
    const defaultUser = {
      id: userId,
      email: `${userId}@example.com`,
      firstName: "Utilisateur",
      lastName: "Temporaire",
      role: "client",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      // Récupérer l'utilisateur depuis notre base de données
      let user = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        // Si l'utilisateur n'existe pas dans notre base de données, le créer
        try {
          user = await prisma.user.create({
            data: {
              id: userId,
              email: `${userId}@example.com`, // Email temporaire
              firstName: "Utilisateur",
              lastName: "Temporaire",
              role: "client",
            },
          });
        } catch (createError) {
          logger.error("Erreur lors de la création de l'utilisateur:", createError);
          // Retourner l'utilisateur par défaut en cas d'erreur
          return NextResponse.json(defaultUser, {
            headers: {
              'Cache-Control': 'no-store',
              'X-Error': 'create_error'
            }
          });
        }
      }
      
      // Mettre en cache l'utilisateur
      userCache[userId] = { user, timestamp: now };
      
      return NextResponse.json(user, {
        headers: {
          'Cache-Control': 'private, max-age=300',
          'X-Cache-Hit': 'false'
        }
      });
    } catch (dbError) {
      logger.error("Erreur de base de données:", dbError);
      // Retourner l'utilisateur par défaut en cas d'erreur de base de données
      return NextResponse.json(defaultUser, {
        headers: {
          'Cache-Control': 'no-store',
          'X-Error': 'database_error'
        }
      });
    }
  } catch (error) {
    logger.error("Erreur lors de la récupération de l'utilisateur:", error);
    // Créer un utilisateur par défaut même en cas d'erreur globale
    const defaultUser = {
      id: "unknown",
      email: "unknown@example.com",
      firstName: "Utilisateur",
      lastName: "Temporaire",
      role: "client",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return NextResponse.json(defaultUser, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Error': 'global_error'
      }
    });
  }
} 