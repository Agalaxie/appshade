import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine et fusionne les classes CSS avec tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  try {
    // Vérifier si la date est valide
    const d = new Date(date)
    if (isNaN(d.getTime())) {
      return "Date invalide"
    }
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  } catch (error) {
    console.error("Erreur de formatage de date:", error, date)
    return "Date invalide"
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    // Vérifier si la date est valide
    const d = new Date(date)
    if (isNaN(d.getTime())) {
      return "Date invalide"
    }
    
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const diffMinutes = Math.floor(diff / 60000)
    const diffHours = Math.floor(diff / 3600000)
    const diffDays = Math.floor(diff / 86400000)

    // Si moins d'une heure
    if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    }
    // Si moins de 24 heures
    if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    }
    // Si moins de 7 jours
    if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    }
    // Sinon, format complet
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d)
  } catch (error) {
    console.error("Erreur de formatage de date:", error, date)
    return "Date invalide"
  }
}
