"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import logger from "@/lib/logger";

// Clé pour stocker l'état de synchronisation dans le localStorage
const SYNC_STATUS_KEY = "user_sync_status";
const SYNC_COOLDOWN = 60000; // 1 minute entre les synchronisations

// Verrou global pour éviter les synchronisations simultanées
// Cette variable est partagée entre toutes les instances du composant
const isSyncInProgress = { current: false };
const lastSyncTime = { current: 0 };

export function UserSync() {
  const { isSignedIn, user } = useUser();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const isMountedRef = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer les timeouts lors du démontage du composant
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Vérifier si une synchronisation a été effectuée récemment
    const checkRecentSync = () => {
      if (!isSignedIn || !user) return false;
      
      // Vérifier le verrou global
      if (isSyncInProgress.current) {
        logger.debug(`Synchronisation déjà en cours, ignorée pour ${user.id}`);
        return true;
      }
      
      // Vérifier le délai minimum entre les synchronisations
      const now = Date.now();
      if (now - lastSyncTime.current < 5000) { // 5 secondes minimum entre les syncs
        logger.debug(`Synchronisation trop récente (${Math.round((now - lastSyncTime.current)/1000)}s), ignorée pour ${user.id}`);
        return true;
      }
      
      try {
        const syncStatus = localStorage.getItem(SYNC_STATUS_KEY);
        if (syncStatus) {
          const { userId, timestamp } = JSON.parse(syncStatus);
          
          // Si c'est le même utilisateur et que la synchronisation est récente
          if (userId === user.id && now - timestamp < SYNC_COOLDOWN) {
            logger.debug(`Synchronisation récente détectée pour ${userId}, ignorée`);
            setSyncSuccess(true);
            return true;
          }
        }
      } catch (e) {
        // En cas d'erreur avec localStorage, continuer avec la synchronisation
        logger.debug("Erreur lors de la vérification du statut de synchronisation:", e);
      }
      
      return false;
    };
    
    // Enregistrer le statut de synchronisation
    const saveSuccessfulSync = () => {
      if (!user) return;
      
      try {
        localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
          userId: user.id,
          timestamp: Date.now()
        }));
        lastSyncTime.current = Date.now();
      } catch (e) {
        logger.debug("Erreur lors de l'enregistrement du statut de synchronisation:", e);
      }
    };
    
    // Synchroniser l'utilisateur avec notre base de données lorsqu'il est connecté
    if (isSignedIn && user && !syncSuccess && syncAttempts < 3) {
      // Vérifier d'abord si une synchronisation récente a été effectuée
      if (checkRecentSync()) return;
      
      // Définir le verrou global
      isSyncInProgress.current = true;
      
      logger.info(`Tentative de synchronisation de l'utilisateur: ${user.id} - Tentative #${syncAttempts + 1}`);
      
      // Incrémenter le compteur de tentatives
      setSyncAttempts(prev => prev + 1);
      
      fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Ajouter un timestamp pour éviter la mise en cache par le navigateur
        cache: "no-store"
      })
        .then((res) => {
          if (!res.ok) {
            logger.warn(`Erreur HTTP: ${res.status} ${res.statusText}`);
            throw new Error(`Erreur ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          if (!isMountedRef.current) return;
          
          logger.debug("Utilisateur synchronisé avec succès:", data);
          setSyncSuccess(true);
          saveSuccessfulSync();
          // Libérer le verrou global
          isSyncInProgress.current = false;
        })
        .catch((error) => {
          if (!isMountedRef.current) return;
          
          logger.error("Erreur détaillée de synchronisation:", error);
          // Libérer le verrou global en cas d'erreur
          isSyncInProgress.current = false;
          
          if (syncAttempts >= 2) {
            // Après 3 tentatives, afficher un message d'erreur discret
            toast.error("Problème de synchronisation du compte. Certaines fonctionnalités pourraient être limitées.");
          } else {
            // Réessayer après un délai
            syncTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                setSyncAttempts(prev => prev);  // Forcer une mise à jour pour déclencher l'effet à nouveau
              }
            }, 5000);  // Attendre 5 secondes avant de réessayer (augmenté pour éviter trop de tentatives)
          }
        });
    }
  }, [isSignedIn, user, syncAttempts, syncSuccess]);

  // Ce composant ne rend rien visuellement
  return null;
} 