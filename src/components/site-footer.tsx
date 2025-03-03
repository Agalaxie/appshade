"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function SiteFooter() {
  const [cookieConsentExists, setCookieConsentExists] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setCookieConsentExists(!!consent);
  }, []);

  const openCookieSettings = () => {
    // Réinitialiser le consentement pour afficher à nouveau la bannière
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} AppShade. Tous droits réservés.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/legal"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Mentions légales
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Conditions d'utilisation
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/cookies"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Cookies
          </Link>
          {cookieConsentExists && (
            <Button
              variant="link"
              className="text-sm text-muted-foreground p-0 h-auto"
              onClick={openCookieSettings}
            >
              Paramètres des cookies
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}