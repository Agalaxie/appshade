"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "@/lib/paypal-config";
import { toast } from "sonner";

interface PayPalSubscriptionProps {
  planId: string;
  showSpinner?: boolean;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export function PayPalSubscription({
  planId,
  showSpinner = true,
  onSuccess,
  onError,
  onCancel,
}: PayPalSubscriptionProps) {
  const [isPending, setIsPending] = useState(false);

  const handleCreateSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: planId,
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const handleApprove = async (data: any) => {
    try {
      toast.success("Abonnement souscrit avec succès !");
      
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Erreur lors de la souscription:", error);
      toast.error("Erreur lors de la souscription. Veuillez réessayer.");
      
      if (onError) {
        onError(error);
      }
    }
  };

  const handleError = (error: any) => {
    console.error("Erreur PayPal:", error);
    toast.error("Une erreur s'est produite avec PayPal. Veuillez réessayer.");
    
    if (onError) {
      onError(error);
    }
  };

  const handleCancel = (data: any) => {
    toast.info("Souscription annulée");
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        vault: true,
        intent: "subscription",
      }}
    >
      {showSpinner && isPending && (
        <div className="flex justify-center items-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
      
      <PayPalButtons
        style={{
          color: "gold",
          shape: "rect",
          label: "subscribe",
          height: 40,
        }}
        createSubscription={handleCreateSubscription}
        onApprove={handleApprove}
        onError={handleError}
        onCancel={handleCancel}
        onInit={() => setIsPending(true)}
      />
    </PayPalScriptProvider>
  );
} 