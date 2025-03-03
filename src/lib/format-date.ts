/**
 * Formate une date au format français
 * @param dateString Chaîne de caractères représentant une date
 * @returns Date formatée au format français (JJ/MM/AAAA HH:MM)
 */
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
} 