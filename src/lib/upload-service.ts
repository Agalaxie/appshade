/**
 * Service pour gérer le téléchargement des fichiers
 */

// Fonction pour convertir un fichier en base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Fonction pour télécharger un fichier vers le serveur
export const uploadFile = async (file: File, ticketId: string): Promise<string> => {
  try {
    // Convertir le fichier en base64
    const base64 = await fileToBase64(file);
    
    // Envoyer le fichier au serveur
    const response = await fetch(`/api/tickets/${ticketId}/attachments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: base64,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du fichier');
    }
    
    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    throw error;
  }
};

// Fonction pour récupérer les pièces jointes d'un ticket
export const getTicketAttachments = async (ticketId: string): Promise<any[]> => {
  try {
    const response = await fetch(`/api/tickets/${ticketId}/attachments`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des pièces jointes');
    }
    
    const data = await response.json();
    return data.attachments;
  } catch (error) {
    console.error('Erreur lors de la récupération des pièces jointes:', error);
    return [];
  }
}; 