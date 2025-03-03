"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Toujours activé
    analytics: true,
    marketing: false,
    preferences: true
  });

  // Vérifier si le consentement a déjà été donné
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    setPreferences({
      essential: true, // Les cookies essentiels sont toujours nécessaires
      analytics: false,
      marketing: false,
      preferences: false
    });
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setOpen(false);
    setShowBanner(false);
  };

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }));

    // Ici, vous pourriez implémenter la logique pour activer/désactiver les cookies
    // en fonction des préférences de l'utilisateur
    if (prefs.analytics) {
      // Activer les cookies d'analyse
      console.log("Cookies d'analyse activés");
    }
    
    if (prefs.marketing) {
      // Activer les cookies marketing
      console.log("Cookies marketing activés");
    }
    
    if (prefs.preferences) {
      // Activer les cookies de préférences
      console.log("Cookies de préférences activés");
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Nous utilisons des cookies</h3>
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site, personnaliser le contenu et les publicités, 
              fournir des fonctionnalités de médias sociaux et analyser notre trafic.
              <Link href="/privacy" className="underline ml-1">
                En savoir plus
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setOpen(true)}>
              Personnaliser
            </Button>
            <Button variant="outline" onClick={handleRejectAll}>
              Refuser tout
            </Button>
            <Button onClick={handleAcceptAll}>
              Accepter tout
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paramètres des cookies</DialogTitle>
            <DialogDescription>
              Personnalisez vos préférences en matière de cookies. Les cookies essentiels sont nécessaires au fonctionnement du site.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox id="essential" checked disabled />
              <div className="grid gap-1.5">
                <Label htmlFor="essential" className="font-medium">
                  Cookies essentiels
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="analytics" 
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, analytics: checked === true})
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="analytics" className="font-medium">
                  Cookies d'analyse
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies nous permettent de mesurer le trafic et d'analyser votre utilisation du site afin d'améliorer nos services.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="marketing" 
                checked={preferences.marketing}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, marketing: checked === true})
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="marketing" className="font-medium">
                  Cookies marketing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont utilisés pour suivre les visiteurs sur les sites web afin d'afficher des publicités pertinentes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox 
                id="preferences" 
                checked={preferences.preferences}
                onCheckedChange={(checked) => 
                  setPreferences({...preferences, preferences: checked === true})
                }
              />
              <div className="grid gap-1.5">
                <Label htmlFor="preferences" className="font-medium">
                  Cookies de préférences
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ces cookies permettent de mémoriser vos préférences afin de personnaliser votre expérience.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSavePreferences}>
              Enregistrer les préférences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 