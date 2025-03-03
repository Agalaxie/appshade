import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/api/webhook(.*)",
    "/legal(.*)",
    "/terms(.*)",
    "/cookies(.*)",
    "/contact",
    "/pricing",
    "/features",
    "/privacy"
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhook(.*)"
  ],
  // Custom function to run before the middleware
  beforeAuth: (req) => {
    // Custom logic here
    return NextResponse.next();
  },
  // Custom function to run after the middleware
  afterAuth: (auth, req) => {
    // Vérifier si l'utilisateur essaie d'accéder à la section admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      console.log("Accès à la section admin vérifié par Clerk");
      
      // Vérifier si l'utilisateur est authentifié
      if (!auth.userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
      
      // Accéder aux métadonnées de manière sécurisée
      const metadata = auth.sessionClaims?.metadata as Record<string, unknown> || {};
      const isAdmin = Array.isArray(metadata.roles) && metadata.roles.includes('admin');
      
      // En mode développement, autoriser temporairement l'accès
      if (process.env.NODE_ENV === 'development') {
        console.log("Accès à la section admin autorisé temporairement");
        return NextResponse.next();
      }
      
      // Si l'utilisateur n'est pas admin, rediriger vers la page client
      if (!isAdmin) {
        console.log("Accès refusé - L'utilisateur n'est pas admin");
        return NextResponse.redirect(new URL('/client', req.url));
      }
    }
    
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)",
    "/api/tickets(.*)",
    "/api/tickets/[id](.*)",
    "/api/sync-user(.*)"
  ],
}; 