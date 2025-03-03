import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les données de l'abonnement
    const data = await request.json();
    const { planId, planName, paymentDetails } = data;

    // Valider les données
    if (!planId || !planName || !paymentDetails) {
      return NextResponse.json(
        { error: "Données d'abonnement incomplètes" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà un abonnement actif
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
    });

    if (existingSubscription) {
      // Mettre à jour l'abonnement existant
      const updatedSubscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          planName,
          status: "active",
          paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
          updatedAt: new Date(),
        },
      });

      // Enregistrer le paiement
      const payment = await prisma.payment.create({
        data: {
          orderId: paymentDetails.orderID,
          payerId: paymentDetails.payer?.payer_id || "",
          amount: parseFloat(paymentDetails.purchase_units[0]?.amount?.value || "0"),
          status: paymentDetails.status,
          email: paymentDetails.payer?.email_address || "",
          description: `Renouvellement abonnement ${planName}`,
          userId,
          subscriptionId: updatedSubscription.id,
        },
      });

      return NextResponse.json({ 
        success: true, 
        subscription: updatedSubscription,
        payment 
      });
    } else {
      // Créer un nouvel abonnement
      const subscription = await prisma.subscription.create({
        data: {
          planId,
          planName,
          status: "active",
          paidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
          userId,
        },
      });

      // Enregistrer le paiement
      const payment = await prisma.payment.create({
        data: {
          orderId: paymentDetails.orderID,
          payerId: paymentDetails.payer?.payer_id || "",
          amount: parseFloat(paymentDetails.purchase_units[0]?.amount?.value || "0"),
          status: paymentDetails.status,
          email: paymentDetails.payer?.email_address || "",
          description: `Nouvel abonnement ${planName}`,
          userId,
          subscriptionId: subscription.id,
        },
      });

      return NextResponse.json({ 
        success: true, 
        subscription,
        payment 
      });
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'abonnement" },
      { status: 500 }
    );
  }
} 