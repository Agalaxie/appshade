/**
 * Service de logging centralisé pour l'application
 * Permet de contrôler les logs en fonction de l'environnement et du niveau de log
 */

// Déterminer l'environnement d'exécution
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';

// Niveaux de log
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

// Configuration du niveau de log par défaut selon l'environnement
const DEFAULT_LOG_LEVEL = isProduction 
  ? LogLevel.ERROR  // En production, seulement les erreurs
  : isDevelopment 
    ? LogLevel.DEBUG // En développement, tous les logs
    : LogLevel.WARN; // En test, warnings et erreurs

// Niveau de log actuel (peut être modifié dynamiquement)
let currentLogLevel = DEFAULT_LOG_LEVEL;

// Cache pour éviter les logs répétitifs
const logCache: Record<string, { count: number, lastTime: number }> = {};
const LOG_CACHE_DURATION = 10000; // 10 secondes entre les logs identiques

/**
 * Formater un message de log avec un préfixe et une couleur
 */
const formatLogMessage = (level: string, message: string): string => {
  return `[${level}] ${message}`;
};

/**
 * Vérifier si un message similaire a été loggé récemment
 * Retourne true si le message doit être throttlé (ignoré)
 */
const shouldThrottleLog = (cacheKey: string): boolean => {
  const now = Date.now();
  
  // Si le message n'est pas dans le cache, l'ajouter
  if (!logCache[cacheKey]) {
    logCache[cacheKey] = { count: 1, lastTime: now };
    return false;
  }
  
  const cachedLog = logCache[cacheKey];
  
  // Si le délai est écoulé, réinitialiser le compteur
  if (now - cachedLog.lastTime > LOG_CACHE_DURATION) {
    logCache[cacheKey] = { count: 1, lastTime: now };
    return false;
  }
  
  // Incrémenter le compteur
  cachedLog.count++;
  
  // Si c'est le 10ème log identique, mettre à jour le temps et afficher un résumé
  if (cachedLog.count === 10) {
    cachedLog.lastTime = now;
    return false; // Permettre l'affichage du résumé
  }
  
  // Throttler les logs entre le 2ème et le 9ème, et après le 10ème
  return cachedLog.count !== 1;
};

/**
 * Service de logging
 */
export const logger = {
  /**
   * Définir le niveau de log
   */
  setLogLevel: (level: LogLevel): void => {
    currentLogLevel = level;
  },
  
  /**
   * Obtenir le niveau de log actuel
   */
  getLogLevel: (): LogLevel => {
    return currentLogLevel;
  },
  
  /**
   * Log de niveau DEBUG
   * Utilisé pour les informations détaillées utiles au développement
   */
  debug: (message: string, ...args: any[]): void => {
    if (currentLogLevel <= LogLevel.DEBUG) {
      const cacheKey = `DEBUG:${message}`;
      if (!shouldThrottleLog(cacheKey)) {
        const cachedLog = logCache[cacheKey];
        const countSuffix = cachedLog && cachedLog.count > 1 
          ? ` (répété ${cachedLog.count} fois)` 
          : '';
        
        console.debug(formatLogMessage('DEBUG', message + countSuffix), ...args);
      }
    }
  },
  
  /**
   * Log de niveau INFO
   * Utilisé pour les informations générales sur le fonctionnement de l'application
   */
  info: (message: string, ...args: any[]): void => {
    if (currentLogLevel <= LogLevel.INFO) {
      const cacheKey = `INFO:${message}`;
      if (!shouldThrottleLog(cacheKey)) {
        const cachedLog = logCache[cacheKey];
        const countSuffix = cachedLog && cachedLog.count > 1 
          ? ` (répété ${cachedLog.count} fois)` 
          : '';
        
        console.info(formatLogMessage('INFO', message + countSuffix), ...args);
      }
    }
  },
  
  /**
   * Log de niveau WARN
   * Utilisé pour les avertissements qui ne bloquent pas l'application
   */
  warn: (message: string, ...args: any[]): void => {
    if (currentLogLevel <= LogLevel.WARN) {
      const cacheKey = `WARN:${message}`;
      if (!shouldThrottleLog(cacheKey)) {
        const cachedLog = logCache[cacheKey];
        const countSuffix = cachedLog && cachedLog.count > 1 
          ? ` (répété ${cachedLog.count} fois)` 
          : '';
        
        console.warn(formatLogMessage('WARN', message + countSuffix), ...args);
      }
    }
  },
  
  /**
   * Log de niveau ERROR
   * Utilisé pour les erreurs qui affectent le fonctionnement de l'application
   */
  error: (message: string, ...args: any[]): void => {
    if (currentLogLevel <= LogLevel.ERROR) {
      const cacheKey = `ERROR:${message}`;
      if (!shouldThrottleLog(cacheKey)) {
        const cachedLog = logCache[cacheKey];
        const countSuffix = cachedLog && cachedLog.count > 1 
          ? ` (répété ${cachedLog.count} fois)` 
          : '';
        
        console.error(formatLogMessage('ERROR', message + countSuffix), ...args);
      }
    }
  },
  
  /**
   * Log une fois seulement
   * Utile pour les messages qui ne doivent apparaître qu'une seule fois
   */
  once: (level: LogLevel, message: string, ...args: any[]): void => {
    const cacheKey = `ONCE:${message}`;
    
    if (logCache[cacheKey]) {
      return;
    }
    
    logCache[cacheKey] = { count: 1, lastTime: Date.now() };
    
    switch (level) {
      case LogLevel.DEBUG:
        logger.debug(message, ...args);
        break;
      case LogLevel.INFO:
        logger.info(message, ...args);
        break;
      case LogLevel.WARN:
        logger.warn(message, ...args);
        break;
      case LogLevel.ERROR:
        logger.error(message, ...args);
        break;
    }
  }
};

// Exporter le logger par défaut
export default logger; 