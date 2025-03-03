import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Contact | AppShade",
  description: "Contactez notre équipe pour toute question ou demande d'assistance",
};

export default function ContactPage() {
  return (
    <div className="container max-w-6xl py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Contactez-nous
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans l'utilisation d'AppShade.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" placeholder="Votre prénom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Nom</Label>
                  <Input id="last-name" placeholder="Votre nom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input id="subject" placeholder="Comment pouvons-nous vous aider ?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Détaillez votre demande ici..."
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">support@appshade.fr</p>
                    <p className="text-muted-foreground">commercial@appshade.fr</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                    <p className="text-muted-foreground">Du lundi au vendredi, 9h-18h</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-muted-foreground">123 Avenue de la Tech</p>
                    <p className="text-muted-foreground">75001 Paris, France</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Horaires d'assistance</h2>
              <p className="text-muted-foreground mb-4">
                Notre équipe de support est disponible pour vous aider :
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h - 14h</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Comment créer un ticket de support ?</h3>
            <p className="text-muted-foreground">
              Connectez-vous à votre compte, accédez à votre tableau de bord et cliquez sur "Nouveau ticket". Remplissez les informations demandées et soumettez votre demande.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Quel est le délai de réponse moyen ?</h3>
            <p className="text-muted-foreground">
              Notre équipe s'engage à répondre à tous les tickets dans un délai de 24 heures ouvrées. Les tickets prioritaires sont traités plus rapidement.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Comment modifier mon abonnement ?</h3>
            <p className="text-muted-foreground">
              Vous pouvez modifier votre abonnement à tout moment depuis votre espace client, dans la section "Abonnement". Les changements prennent effet au prochain cycle de facturation.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">Proposez-vous des formations ?</h3>
            <p className="text-muted-foreground">
              Oui, nous proposons des sessions de formation personnalisées pour vous aider à tirer le meilleur parti d'AppShade. Contactez notre équipe commerciale pour plus d'informations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 