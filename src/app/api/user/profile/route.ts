import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import logger from "@/lib/logger";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/user/profile - Récupérer le profil de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    logger.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/user/profile - Mettre à jour le profil de l'utilisateur connecté
export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    
    // Récupérer les données du profil
    const data = await request.json();
    
    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        role: "client",
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 