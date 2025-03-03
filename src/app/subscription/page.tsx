"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PayPalCheckoutButton } from "@/components/paypal-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Plans d'abonnement
const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "29.99",
    features: [
      "Jusqu'à 5 utilisateurs",
      "Jusqu'à 20 tickets par mois",
      "Support par email",
      "Temps de réponse sous 24h",
    ],
    recommended: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "59.99",
    features: [
      "Jusqu'à 15 utilisateurs",
      "Tickets illimités",
      "Support par email et téléphone",
      "Temps de réponse sous 12h",
      "Tableau de bord avancé",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "99.99",
    features: [
      "Utilisateurs illimités",
      "Tickets illimités",
      "Support prioritaire 24/7",
      "Temps de réponse sous 4h",
      "Tableau de bord avancé",
      "API personnalisée",
      "Formation dédiée",
    ],
    recommended: false,
  },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (details: any) => {
    try {
      // Enregistrer l'abonnement
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: selectedPlan,
          planName: plans.find(p => p.id === selectedPlan)?.name,
          paymentDetails: details,
        }),
      });

      if (response.ok) {
        toast.success("Abonnement activé avec succès !");
        router.push("/dashboard");
      } else {
        toast.error("Erreur lors de l'activation de l'abonnement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choisissez votre plan</h1>
        <p className="text-muted-foreground">
          Sélectionnez le plan qui correspond le mieux à vos besoins
        </p>
      </div>

      {!showPayment ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.recommended ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.recommended && (
                    <Badge className="bg-primary text-primary-foreground">Recommandé</Badge>
                  )}
                </div>
                <CardDescription>
                  <span className="text-3xl font-bold">{plan.price}€</span> / mois
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.recommended ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  Sélectionner
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Paiement pour {selectedPlanData?.name}</CardTitle>
              <CardDescription>
                Montant: {selectedPlanData?.price}€ / mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PayPalCheckoutButton 
                amount={selectedPlanData?.price || "0"} 
                description={`Abonnement ${selectedPlanData?.name} - AppShade`}
                onSuccess={handlePaymentSuccess}
                onError={() => toast.error("Erreur lors du paiement")}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setShowPayment(false)}>
                Retour
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
} 