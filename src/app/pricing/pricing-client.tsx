"use client";

import React from "react";
import { PricingClientWrapper } from "./client";
import { CheckIcon, CrownIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPageClient() {
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Tarification simple et transparente
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Choisissez la formule qui correspond le mieux à vos besoins. Tous nos plans incluent un support client de qualité.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12 max-w-7xl mx-auto">
        {/* Plan Founders */}
        <Card className="relative border-2 border-primary shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="absolute -top-5 left-0 right-0 flex justify-center">
            <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full flex items-center gap-1">
              <CrownIcon className="h-4 w-4" />
              ACCÈS EXCLUSIF BETA
            </Badge>
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <CrownIcon className="h-6 w-6 text-yellow-500" />
              Pack Founders
            </CardTitle>
            <div className="mt-1 flex items-baseline justify-center">
              <span className="text-5xl font-extrabold tracking-tight">49€</span>
              <span className="ml-1 text-xl font-semibold text-muted-foreground">/unique</span>
            </div>
            <CardDescription className="mt-2 text-sm">
              Soyez parmi les premiers à accéder à notre plateforme et bénéficiez d'avantages exclusifs à vie
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Accès complet à la version bêta</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Badge Founder exclusif sur votre profil</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>-50% sur l'abonnement Premium à vie</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Accès prioritaire aux nouvelles fonctionnalités</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Support prioritaire dédié</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Nombre de places limité</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <PricingClientWrapper planId="founders" price={49} />
          </CardFooter>
        </Card>

        {/* Plan Standard */}
        <Card className="border shadow-md transform hover:scale-105 transition-transform duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Standard</CardTitle>
            <div className="mt-1 flex items-baseline justify-center">
              <span className="text-5xl font-extrabold tracking-tight">9,99€</span>
              <span className="ml-1 text-xl font-semibold text-muted-foreground">/mois</span>
            </div>
            <CardDescription className="mt-2 text-sm">
              Parfait pour les petites entreprises et les indépendants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Jusqu'à 10 tickets simultanés</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Temps de réponse sous 24h</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Accès à toutes les fonctionnalités de base</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Support par email</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <PricingClientWrapper planId="standard" price={9.99} />
          </CardFooter>
        </Card>

        {/* Plan Premium */}
        <Card className="border shadow-md transform hover:scale-105 transition-transform duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Premium</CardTitle>
            <div className="mt-1 flex items-baseline justify-center">
              <span className="text-5xl font-extrabold tracking-tight">19,99€</span>
              <span className="ml-1 text-xl font-semibold text-muted-foreground">/mois</span>
            </div>
            <CardDescription className="mt-2 text-sm">
              Pour les entreprises qui ont besoin d'un support avancé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Tickets illimités</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Temps de réponse sous 4h</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Fonctionnalités avancées</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Support téléphonique prioritaire</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                <span>Tableau de bord analytique</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <PricingClientWrapper planId="premium" price={19.99} />
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          Vous avez des besoins spécifiques ? <a href="/contact" className="text-primary font-medium hover:underline">Contactez-nous</a> pour une offre personnalisée.
        </p>
      </div>
    </div>
  );
}
