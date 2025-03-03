"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    name: "Fonctionnalités",
    href: "/features",
  },
  {
    name: "Tarification",
    href: "/pricing",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Menu hamburger pour mobile */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>

        {/* Logo et navigation pour desktop */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">
              AppShade
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logo pour mobile (visible quand le menu est fermé) */}
        <div className="md:hidden flex-1 flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">AppShade</span>
          </Link>
        </div>
        
        {/* Boutons de connexion et tableau de bord alignés à droite */}
        <nav className="flex items-center">
          <SignedOut>
            <Button variant="outline" asChild className="mr-2">
              <Link href="/sign-in">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Inscription</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button variant="outline" asChild className="mr-2">
              <Link href="/client">Tableau de bord</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80 text-sm font-medium p-2",
                  pathname === item.href
                    ? "bg-accent text-foreground"
                    : "text-foreground/60"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
} 