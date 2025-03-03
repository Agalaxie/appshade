"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface PricingClientWrapperProps {
  planId: string;
  price: number;
}

export function PricingClientWrapper({ planId, price }: PricingClientWrapperProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handlePurchase = () => {
    // Ici, vous pourriez intégrer un système de paiement comme Stripe
    // Pour l'instant, nous affichons simplement une notification
    toast({
      title: "Achat en cours de développement",
      description: `Le plan ${planId} à ${price}€ sera bientôt disponible à l'achat.`,
      duration: 5000,
    });
  };

  return (
    <Button 
      className="w-full" 
      onClick={handlePurchase}
      variant={planId === "founders" ? "default" : "outline"}
    >
      {planId === "founders" ? "Devenir Founder" : "Choisir ce plan"}
    </Button>
  );
} 