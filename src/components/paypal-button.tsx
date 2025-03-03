"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID, PAYPAL_OPTIONS } from "@/lib/paypal-config";
import { toast } from "@/components/ui/use-toast";

interface PayPalButtonProps {
  amount: string;
  description: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
}

export function PayPalCheckoutButton({ 
  amount, 
  description, 
  onSuccess, 
  onError 
}: PayPalButtonProps) {
  const [isPending, setIsPending] = useState(true);

  const handleCreateOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: description,
          amount: {
            value: amount,
            currency_code: "EUR"
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const handleApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      toast({
        title: "Paiement réussi !",
        description: "Votre paiement a été traité avec succès."
      });
      
      // Enregistrer la transaction dans votre base de données
      try {
        await fetch("/api/payments/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paypalOrderId: data.orderID,
            details: details,
            amount: amount,
            currency: "EUR",
          }),
        });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du paiement:", error);
      }

      if (onSuccess) {
        onSuccess(details);
      }
    } catch (error) {
      console.error("Erreur lors de la capture du paiement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive"
      });
      
      if (onError) {
        onError(error);
      }
    }
  };

  const handleError = (err: any) => {
    console.error("Erreur PayPal:", err);
    toast({
      title: "Erreur PayPal",
      description: "Une erreur est survenue avec PayPal",
      variant: "destructive"
    });
    
    if (onError) {
      onError(err);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: "sb",
        currency: "EUR",
        intent: "capture",
      }}
    >
      <div className="w-full max-w-md mx-auto">
        {isPending && (
          <div className="flex justify-center items-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay"
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={handleError}
          onCancel={() => toast({
            title: "Information",
            description: "Paiement annulé"
          })}
          onInit={() => setIsPending(false)}
        />
      </div>
    </PayPalScriptProvider>
  );
} 