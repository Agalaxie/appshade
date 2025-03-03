import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import logger from "@/lib/logger";

// POST /api/subscriptions/record - Enregistrer un abonnement PayPal
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const { userId } = auth();
    if (!userId) {
      logger.error("Abonnement: Utilisateur non authentifié");
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les données de la requête
    const body = await request.json();
    const { subscriptionId, planId } = body;

    if (!subscriptionId || !planId) {
      return NextResponse.json(
        { error: "Données d'abonnement manquantes" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur avec les informations d'abonnement
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: "client", // Assurer que l'utilisateur a au moins le rôle client
        updatedAt: new Date(),
      },
    });

    // Enregistrer l'abonnement dans la base de données
    // Nous utilisons une requête directe à la base de données car le modèle Subscription
    // n'est peut-être pas défini dans le schéma Prisma
    const result = await prisma.$executeRaw`
      INSERT INTO "Subscription" (
        "userId", 
        "planId", 
        "externalId", 
        "status", 
        "startDate", 
        "endDate", 
        "provider", 
        "createdAt", 
        "updatedAt"
      ) 
      VALUES (
        ${userId}, 
        ${planId}, 
        ${subscriptionId}, 
        'active', 
        ${new Date()}, 
        ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}, 
        'paypal', 
        ${new Date()}, 
        ${new Date()}
      )
      ON CONFLICT ("userId") 
      DO UPDATE SET 
        "planId" = ${planId},
        "externalId" = ${subscriptionId},
        "status" = 'active',
        "startDate" = ${new Date()},
        "endDate" = ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)},
        "updatedAt" = ${new Date()}
    `;

    logger.info(`Abonnement enregistré avec succès pour l'utilisateur: ${userId}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Abonnement enregistré avec succès",
        data: {
          subscriptionId,
          planId,
          userId,
          createdAt: new Date(),
        }
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors de l'enregistrement de l'abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de l'abonnement" },
      { status: 500 }
    );
  }
} 