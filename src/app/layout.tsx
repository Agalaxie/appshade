import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MainNav } from "@/components/layout/MainNav";
import { UserSync } from "@/components/user-sync";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AppShade - Gestion de tickets',
  description: 'Plateforme de gestion de tickets de support',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider 
      localization={frFR}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: 'rgb(var(--primary))' },
      }}
      navigate={(to) => {
        window.location.href = to;
      }}
    >
      <html lang="fr" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        </head>
        <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <MainNav />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
            <CookieConsent />
            <Toaster />
            <UserSync />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
} 