import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useRoles() {
  const { user, isLoaded } = useUser();
  const [roles, setRoles] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isLoaded && user) {
      // Récupérer les rôles depuis les métadonnées publiques
      const userRoles = user.publicMetadata?.roles as string[] || [];
      
      // Informations de débogage
      const debugInfo = {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        publicMetadata: user.publicMetadata,
        roles: userRoles,
        hasRoles: Array.isArray(userRoles) && userRoles.length > 0
      };
      
      console.log("useRoles - Informations utilisateur:", debugInfo);
      setDebug(debugInfo);
      
      setRoles(userRoles);
      setIsAdmin(Array.isArray(userRoles) && userRoles.includes("admin"));
      setIsClient(Array.isArray(userRoles) && userRoles.includes("client"));
      
      // En mode développement, autoriser l'accès admin pour le débogage
      if (process.env.NODE_ENV === 'development') {
        console.log("Mode développement: accès admin autorisé pour le débogage");
        setIsAdmin(true);
      }
      
      setLoading(false);
    } else if (isLoaded && !user) {
      setRoles([]);
      setIsAdmin(false);
      setIsClient(false);
      setLoading(false);
      setDebug({ status: "not-authenticated" });
    }
  }, [isLoaded, user]);

  return {
    roles,
    isAdmin,
    isClient,
    loading,
    debug
  };
}