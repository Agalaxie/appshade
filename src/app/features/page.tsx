import { Metadata } from "next";
import Link from "next/link";
import { 
  TicketIcon, 
  MessageSquareIcon, 
  CreditCardIcon, 
  ShieldCheckIcon, 
  BellIcon, 
  UsersIcon, 
  LayoutDashboardIcon, 
  FileTextIcon,
  CheckIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Fonctionnalités | AppShade",
  description: "Découvrez toutes les fonctionnalités d'AppShade pour gérer vos tickets de support et votre relation client",
  keywords: "AppShade, fonctionnalités, tickets, support, relation client, gestion de tickets",
  openGraph: {
    title: "Fonctionnalités | AppShade",
    description: "Découvrez toutes les fonctionnalités d'AppShade pour gérer vos tickets de support et votre relation client",
    type: "website",
    locale: "fr_FR",
  },
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface DetailedFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  imageUrl?: string;
  reverse?: boolean;
}

function DetailedFeature({ icon, title, description, benefits, imageUrl, reverse = false }: DetailedFeatureProps) {
  return (
    <div className={`flex flex-col gap-8 ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
      <div className="flex-1 space-y-4">
        <div className="inline-flex rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <ul className="space-y-2">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 rounded-lg bg-muted/50 p-2">
        <div className="h-[300px] rounded-md bg-muted/80 flex items-center justify-center text-muted-foreground">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-full w-full object-cover rounded-md" 
            />
          ) : (
            <span>Capture d'écran de la fonctionnalité</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="container max-w-6xl py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Fonctionnalités d'AppShade
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          La solution SaaS complète pour les entreprises qui souhaitent offrir un support client exceptionnel à leurs utilisateurs.
        </p>
      </div>

      {/* Case Study / Use Case Section */}
      <div className="mb-20 p-6 border rounded-lg bg-card">
        <h2 className="text-2xl font-bold mb-4">Comment AppShade transforme votre service client</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pour votre entreprise</h3>
            <p className="text-muted-foreground">
              En tant qu'entreprise, vous cherchez à offrir un support client de qualité sans investir dans des solutions complexes et coûteuses.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Déployez rapidement un système de tickets personnalisé à vos couleurs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Centralisez toutes les demandes client en un seul endroit</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Réduisez le temps de réponse et améliorez la satisfaction client</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Analysez les performances de votre support avec des rapports détaillés</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Pour vos clients</h3>
            <p className="text-muted-foreground">
              Vos clients bénéficient d'une expérience de support fluide et professionnelle qui renforce leur confiance en votre marque.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Interface intuitive pour soumettre et suivre leurs demandes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Communication transparente avec votre équipe de support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Notifications en temps réel sur l'avancement de leurs tickets</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <span>Accès à l'historique complet de leurs interactions avec votre support</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Cas d'usage : Société de logiciel SaaS</h4>
          <p>
            TechSolutions, une entreprise de 25 employés proposant une solution de gestion de projet, a intégré AppShade pour gérer les demandes de support de ses 2000+ utilisateurs. Résultats après 3 mois :
          </p>
          <ul className="mt-2 space-y-1">
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Réduction de 45% du temps de réponse moyen</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Augmentation de 30% de la satisfaction client</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Économie de 15 heures/semaine pour l'équipe support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-20">
        <Feature
          icon={<TicketIcon className="h-6 w-6" />}
          title="Gestion de tickets"
          description="Créez, suivez et résolvez les tickets de support de vos clients en toute simplicité."
        />
        <Feature
          icon={<MessageSquareIcon className="h-6 w-6" />}
          title="Messagerie intégrée"
          description="Communiquez directement avec vos clients via notre système de messagerie intégré."
        />
        <Feature
          icon={<CreditCardIcon className="h-6 w-6" />}
          title="Paiements sécurisés"
          description="Acceptez les paiements en ligne via PayPal pour vos services de support."
        />
        <Feature
          icon={<ShieldCheckIcon className="h-6 w-6" />}
          title="Sécurité avancée"
          description="Protégez les données de vos clients avec notre système de sécurité robuste."
        />
        <Feature
          icon={<BellIcon className="h-6 w-6" />}
          title="Notifications"
          description="Restez informé des mises à jour de tickets avec des notifications en temps réel."
        />
        <Feature
          icon={<UsersIcon className="h-6 w-6" />}
          title="Gestion des utilisateurs"
          description="Gérez facilement les comptes clients et les permissions d'accès."
        />
      </div>

      {/* Detailed Features */}
      <div className="space-y-24 mb-16">
        <DetailedFeature
          icon={<TicketIcon className="h-6 w-6" />}
          title="Système de tickets B2B avancé"
          description="Offrez à vos clients un système de support professionnel entièrement personnalisable à l'image de votre entreprise."
          benefits={[
            "Portail client personnalisable avec votre logo et vos couleurs",
            "Catégorisation avancée des tickets pour une meilleure organisation",
            "Suivi de l'historique complet des interactions client",
            "Assignation automatique ou manuelle des tickets à votre équipe",
            "Intégration avec vos outils existants (CRM, email, Slack)"
          ]}
        />

        <DetailedFeature
          icon={<MessageSquareIcon className="h-6 w-6" />}
          title="Communication multi-canal"
          description="Permettez à vos clients de vous contacter via leur canal préféré tout en centralisant toutes les communications."
          benefits={[
            "Support par email, chat et formulaire web dans une interface unifiée",
            "Réponses automatiques personnalisables pour les questions fréquentes",
            "Modèles de réponses pour standardiser votre communication",
            "Historique complet des conversations accessible à toute votre équipe",
            "Notifications intelligentes pour ne jamais manquer une demande importante"
          ]}
          reverse={true}
        />

        <DetailedFeature
          icon={<LayoutDashboardIcon className="h-6 w-6" />}
          title="Tableau de bord analytique"
          description="Prenez des décisions basées sur les données avec notre tableau de bord conçu pour les équipes de support B2B."
          benefits={[
            "Métriques clés de performance (temps de réponse, taux de résolution)",
            "Segmentation des données par client, catégorie ou agent",
            "Identification des tendances et des problèmes récurrents",
            "Prévision de la charge de travail basée sur l'historique",
            "Rapports personnalisés exportables pour vos réunions d'équipe"
          ]}
        />

        <DetailedFeature
          icon={<UsersIcon className="h-6 w-6" />}
          title="Gestion multi-niveaux des utilisateurs"
          description="Structurez votre équipe de support et vos clients avec un système de permissions flexible et sécurisé."
          benefits={[
            "Différents niveaux d'accès pour administrateurs, agents et clients",
            "Possibilité pour vos clients de gérer leurs propres utilisateurs",
            "Authentification sécurisée avec options SSO pour vos clients B2B",
            "Suivi des actions de chaque utilisateur pour une transparence totale",
            "Transfert de tickets entre équipes ou niveaux de support"
          ]}
          reverse={true}
        />
      </div>

      {/* CTA Section */}
      <Card className="border-0 bg-primary/5">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Prêt à transformer votre support client B2B ?</h3>
            <p className="text-muted-foreground">
              Rejoignez les entreprises qui offrent une expérience de support exceptionnelle avec AppShade.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Démarrer votre essai gratuit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 