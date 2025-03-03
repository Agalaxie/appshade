import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
  retries?: number;
  retryDelay?: number;
  refreshInterval?: number | null; // Option pour contrôler le rafraîchissement automatique
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
  stopAutoRefresh: () => void; // Fonction pour arrêter le rafraîchissement automatique
}

// Fonction utilitaire pour attendre un délai
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache global pour stocker les résultats des appels API
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute de cache

// Verrous pour éviter les appels simultanés ou trop fréquents
const apiLocks = new Map<string, boolean>();
const apiLastCallTime = new Map<string, number>();
const MIN_CALL_INTERVAL = 10000; // 10 secondes minimum entre les appels
const INITIAL_DELAY = 1000; // Délai initial de 1 seconde avant le premier appel

// Compteur global pour suivre le nombre d'appels par URL
const apiCallCounter = new Map<string, number>();

// Fonction pour vider le cache d'une URL spécifique ou de toutes les URL liées à un pattern
export function clearApiCache(urlOrPattern?: string) {
  if (!urlOrPattern) {
    // Vider tout le cache
    apiCache.clear();
    console.log('Cache API entièrement vidé');
    return;
  }

  // Si c'est une URL exacte
  if (apiCache.has(urlOrPattern)) {
    apiCache.delete(urlOrPattern);
    console.log(`Cache pour ${urlOrPattern} vidé`);
    return;
  }

  // Si c'est un pattern, vider toutes les URL qui le contiennent
  let count = 0;
  const urls = Array.from(apiCache.keys());
  for (const url of urls) {
    if (url.includes(urlOrPattern)) {
      apiCache.delete(url);
      count++;
    }
  }
  
  if (count > 0) {
    console.log(`${count} entrées de cache contenant "${urlOrPattern}" ont été vidées`);
  }
}

export function useApi<T = any>(
  url: string, 
  options: FetchOptions = {}
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const initialLoadRef = useRef<boolean>(true);
  const hasCalledRef = useRef<boolean>(false);

  // Vérifier si l'URL est valide
  if (!url || url === '') {
    return {
      data: null,
      error: 'URL invalide',
      loading: false,
      refetch: async () => {},
      stopAutoRefresh: () => {},
    };
  }

  // Nettoyer le timer lors du démontage du composant
  useEffect(() => {
    isMountedRef.current = true;
    
    // Incrémenter le compteur d'appels pour cette URL
    const currentCount = apiCallCounter.get(url) || 0;
    apiCallCounter.set(url, currentCount + 1);
    
    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      
      // Décrémenter le compteur d'appels pour cette URL
      const currentCount = apiCallCounter.get(url) || 0;
      if (currentCount > 0) {
        apiCallCounter.set(url, currentCount - 1);
      }
      
      // Libérer le verrou seulement si c'est le dernier composant utilisant cette URL
      if ((apiCallCounter.get(url) || 0) === 0) {
        apiLocks.set(url, false);
      }
    };
  }, [url]);

  const fetchData = useCallback(async (force = false) => {
    // Si on a déjà fait un appel et qu'on n'est pas en mode force, ne rien faire
    if (hasCalledRef.current && !force) {
      return;
    }
    
    // Vérifier si l'URL est verrouillée (appel en cours)
    if (apiLocks.get(url)) {
      return;
    }
    
    // Vérifier si l'appel est trop fréquent
    const now = Date.now();
    const lastCallTime = apiLastCallTime.get(url) || 0;
    if (!force && !initialLoadRef.current && now - lastCallTime < MIN_CALL_INTERVAL) {
      return;
    }
    
    // Verrouiller l'URL
    apiLocks.set(url, true);
    apiLastCallTime.set(url, now);
    hasCalledRef.current = true;
    
    // Vérifier le cache si ce n'est pas un appel forcé
    if (!force) {
      const cachedData = apiCache.get(url);
      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        if (isMountedRef.current) {
          setData(cachedData.data);
          setLoading(false);
        }
        // Libérer le verrou
        apiLocks.set(url, false);
        return;
      }
    }
    
    // Paramètres par défaut pour les retry
    const maxRetries = options.retries || 1; // Réduire le nombre de retries
    const retryDelay = options.retryDelay || 2000; // Augmenter le délai entre les retries
    let retryCount = 0;
    let success = false;

    try {
      if (isMountedRef.current) {
        // Ne pas remettre loading à true si on a déjà des données
        // Cela évite le clignotement lors des rafraîchissements
        if (!data) {
          setLoading(true);
        }
        setError(null);
      }

      // Boucle de retry
      while (!success && retryCount <= maxRetries) {
        try {
          const fetchOptions: RequestInit = {
            method: options.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
            cache: 'no-store', // Désactiver le cache pour éviter les problèmes de permissions
          };

          if (options.body && options.method !== 'GET') {
            fetchOptions.body = JSON.stringify(options.body);
          }

          // Ajouter un timeout pour éviter les requêtes qui bloquent trop longtemps
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 secondes de timeout
          fetchOptions.signal = controller.signal;

          const response = await fetch(url, fetchOptions);
          clearTimeout(timeoutId);

          if (!response.ok) {
            // Si c'est une erreur 500, on peut retenter
            if (response.status >= 500 && retryCount < maxRetries) {
              throw new Error(`Erreur serveur ${response.status}`);
            }
            
            // Si c'est une erreur 401, l'utilisateur n'est probablement pas connecté
            if (response.status === 401) {
              throw new Error("Vous devez être connecté pour accéder à cette ressource");
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          
          // Mettre en cache les résultats
          apiCache.set(url, { data: result, timestamp: Date.now() });
          
          if (isMountedRef.current) {
            setData(result);
          }
          success = true;
          initialLoadRef.current = false;
          break;
        } catch (err) {
          // Si c'est une erreur d'abort (timeout), on ne compte pas comme un retry
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('La requête a pris trop de temps');
          }
          
          // Si on a encore des retries, on attend et on réessaie
          if (retryCount < maxRetries) {
            // Réduire les logs pour éviter de polluer la console
            if (retryCount === 0) {
              console.warn(`Tentative échouée pour ${url}. Nouvelle tentative...`);
            }
            await delay(retryDelay * (retryCount + 1)); // Délai exponentiel
            retryCount++;
          } else {
            // Plus de retries, on propage l'erreur
            throw err;
          }
        }
      }
    } catch (err) {
      // Réduire les logs pour éviter de polluer la console
      console.error(`Erreur lors de l'appel à ${url}`);
      
      // Si on a des données précédentes, on les garde
      if (!data) {
        // Pour les erreurs de réseau, on renvoie un message plus convivial
        if (err instanceof TypeError && err.message.includes('fetch')) {
          if (isMountedRef.current) {
            setError('Problème de connexion au serveur. Veuillez vérifier votre connexion internet.');
          }
        } else {
          if (isMountedRef.current) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
          }
        }
      } else {
        // Si on a des données, on affiche juste un avertissement mais on garde les données
        if (isMountedRef.current) {
          setError('Erreur de rafraîchissement. Données potentiellement obsolètes.');
        }
      }
    } finally {
      // Libérer le verrou seulement si c'est le dernier composant utilisant cette URL
      if ((apiCallCounter.get(url) || 0) <= 1) {
        apiLocks.set(url, false);
      }
      
      if (isMountedRef.current) {
        setLoading(false);
      }
      
      // Configurer le rafraîchissement automatique si demandé
      if (isMountedRef.current && options.refreshInterval && options.refreshInterval > 0) {
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }
        refreshTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) { // Vérifier à nouveau si le composant est monté
            fetchData(true);
          }
        }, options.refreshInterval);
      }
    }
  }, [url, options.method, options.body, options.headers, options.retries, options.retryDelay, options.refreshInterval, data]);

  // Effectuer le premier appel au montage du composant
  useEffect(() => {
    // Attendre un délai plus long avant le premier appel pour éviter les appels multiples
    // lors des navigations rapides
    const timer = setTimeout(() => {
      if (isMountedRef.current && !hasCalledRef.current) {
        fetchData(true); // Force le premier appel
      }
    }, INITIAL_DELAY);
    
    // Nettoyage lors du démontage
    return () => {
      clearTimeout(timer);
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(true); // Force le rafraîchissement
  }, [fetchData]);
  
  const stopAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  return { data, error, loading, refetch, stopAutoRefresh };
}

export function useMutation<T = any, U = any>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = useCallback(
    async (body?: U) => {
      console.log(`Mutation API - Méthode: ${method}, URL: ${url}, Data:`, body);
      setLoading(true);
      setError(null);

      let retryCount = 0;
      const maxRetries = 1; // Une seule retry pour les mutations

      try {
        while (retryCount <= maxRetries) {
          try {
            console.log(`Mutation API - Tentative ${retryCount + 1}/${maxRetries + 1}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes de timeout

            const response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: body ? JSON.stringify(body) : undefined,
              signal: controller.signal,
              cache: 'no-cache', // Utiliser no-cache pour éviter les problèmes de cache
            });

            clearTimeout(timeoutId);
            console.log(`Mutation API - Statut de la réponse: ${response.status}`);

            if (!response.ok) {
              // Si c'est une erreur 500, on peut retenter
              if (response.status >= 500 && retryCount < maxRetries) {
                console.log(`Mutation API - Erreur ${response.status}, nouvelle tentative...`);
                retryCount++;
                await delay(1000);
                continue;
              }
              
              const errorData = await response.json().catch(() => ({}));
              console.log(`Mutation API - Données d'erreur:`, errorData);
              throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`Mutation API - Résultat:`, result);
            setData(result);
            
            // Invalider le cache pour les URL liées après une mutation
            if (url.includes('/tickets')) {
              // Si on crée/modifie/supprime un ticket, on invalide la liste des tickets
              console.log(`Mutation API - Invalidation du cache pour /api/tickets`);
              clearApiCache('/api/tickets');
              
              // Si c'est une suppression, invalider aussi les détails du ticket
              if (method === 'DELETE') {
                console.log(`Mutation API - Invalidation du cache pour ${url}`);
                clearApiCache(url);
              }
            }
            
            return result;
          } catch (err) {
            // Si c'est une erreur d'abort (timeout), on ne compte pas comme un retry
            if (err instanceof DOMException && err.name === 'AbortError') {
              throw new Error('La requête a pris trop de temps');
            }
            
            // Si on a encore des retries, on attend et on réessaie
            if (retryCount < maxRetries) {
              console.warn(`Tentative de mutation échouée pour ${url}. Nouvelle tentative...`);
              retryCount++;
              await delay(1000);
            } else {
              // Plus de retries, on propage l'erreur
              throw err;
            }
          }
        }
        
        throw new Error('Toutes les tentatives ont échoué');
      } catch (err) {
        console.error("Mutation API - Erreur:", err);
        // Pour les erreurs de réseau, on renvoie un message plus convivial
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setError('Problème de connexion au serveur. Veuillez vérifier votre connexion internet.');
        } else {
          setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { mutate, data, error, loading };
} 