import { Metadata } from "next";
import PricingPageClient from "./pricing-client";

export const metadata: Metadata = {
  title: "Tarification | AppShade",
  description: "Découvrez nos différentes formules d'abonnement et choisissez celle qui correspond le mieux à vos besoins.",
  keywords: "tarification, prix, abonnement, founders, premium, standard, appshade",
  openGraph: {
    title: "Tarification | AppShade",
    description: "Découvrez nos différentes formules d'abonnement et choisissez celle qui correspond le mieux à vos besoins.",
    url: "https://appshade.fr/pricing",
    siteName: "AppShade",
    locale: "fr_FR",
    type: "website",
  },
};

// Page côté serveur qui importe le composant client
export default function PricingPage() {
  return <PricingPageClient />;
} 