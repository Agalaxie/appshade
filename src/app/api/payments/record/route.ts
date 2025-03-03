import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import logger from "@/lib/logger";

// POST /api/payments/record - Enregistrer un paiement PayPal
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();

    if (!userId) {
      logger.error("Paiement: Utilisateur non authentifié");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les données du paiement
    const data = await request.json();
    const { paypalOrderId, details, amount, currency } = data;

    if (!paypalOrderId || !amount) {
      return NextResponse.json(
        { error: "Données de paiement incomplètes" },
        { status: 400 }
      );
    }

    // Enregistrer le paiement dans la base de données
    const payment = await prisma.payment.create({
      data: {
        orderId: paypalOrderId,
        userId,
        amount: parseFloat(amount),
        currency: currency || "EUR",
        status: "completed",
        description: "Paiement PayPal",
        email: details?.payer?.email_address || null,
      },
    });

    logger.info(`Paiement enregistré avec succès: ${payment.id}`);

    // Mettre à jour le statut de l'utilisateur si nécessaire
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "client", // Assurer que l'utilisateur a au moins le rôle client
        updatedAt: new Date(),
        // Nous stockons les informations d'abonnement dans les métadonnées
        profileCompleted: true
      },
    });

    return NextResponse.json(
      { success: true, paymentId: payment.id },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Erreur lors de l'enregistrement du paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du paiement" },
      { status: 500 }
    );
  }
} 