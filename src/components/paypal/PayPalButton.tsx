"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "@/lib/paypal-config";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  showSpinner?: boolean;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  description?: string;
}

export function PayPalButton({
  amount,
  currency = "EUR",
  showSpinner = true,
  onSuccess,
  onError,
  onCancel,
  description = "Achat sur AppShade",
}: PayPalButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleCreateOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: description,
          amount: {
            value: amount.toString(),
            currency_code: currency,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const handleApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      toast.success("Paiement réussi !");
      
      if (onSuccess) {
        onSuccess(details);
      }
    } catch (error) {
      console.error("Erreur lors de la capture du paiement:", error);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
      
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
    toast.info("Paiement annulé");
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: currency,
        intent: "capture",
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
          label: "pay",
          height: 40,
        }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={handleError}
        onCancel={handleCancel}
        onInit={() => setIsPending(true)}
      />
    </PayPalScriptProvider>
  );
} 