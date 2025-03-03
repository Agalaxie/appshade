"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

interface NavItem {
  title: string;
  href: string;
}

interface SiteHeaderProps {
  navItems: NavItem[];
}

export function SiteHeader({ navItems }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
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
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other elements can go here */}
          </div>
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
      </div>
    </header>
  );
} 