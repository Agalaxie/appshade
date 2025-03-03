import { Ticket, Client, Message, User } from '@/types';

export const tickets: Ticket[] = [
  {
    id: 'TK-1234',
    title: 'Problème de connexion',
    description: 'Je ne peux pas me connecter à mon compte.',
    status: 'in_progress',
    priority: 'high',
    category: 'technical',
    createdAt: '2023-02-25T10:30:00Z',
    updatedAt: '2023-02-25T14:20:00Z',
    clientId: 'client-1',
    assignedToId: 'admin-1',
    userId: 'client-1'
  },
  {
    id: 'TK-1233',
    title: 'Erreur lors du paiement',
    description: 'J\'ai reçu une erreur lors de ma tentative de paiement.',
    status: 'open',
    priority: 'urgent',
    category: 'billing',
    createdAt: '2023-02-24T09:15:00Z',
    updatedAt: '2023-02-24T09:15:00Z',
    clientId: 'client-2',
    userId: 'client-2'
  },
  {
    id: 'TK-1232',
    title: 'Demande de fonctionnalité',
    description: 'J\'aimerais suggérer une nouvelle fonctionnalité.',
    status: 'closed',
    priority: 'low',
    category: 'feature',
    createdAt: '2023-02-20T16:45:00Z',
    updatedAt: '2023-02-22T11:30:00Z',
    clientId: 'client-3',
    assignedToId: 'admin-2',
    userId: 'client-3'
  }
];

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    company: 'Entreprise A',
    createdAt: '2023-01-15T08:00:00Z'
  },
  {
    id: 'client-2',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    company: 'Entreprise B',
    createdAt: '2023-01-20T10:30:00Z'
  },
  {
    id: 'client-3',
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    createdAt: '2023-02-01T14:15:00Z'
  }
];

export const messages: Message[] = [
  {
    id: 'msg-1',
    content: 'Votre ticket a été mis à jour',
    ticketId: 'TK-1234',
    senderId: 'admin-1',
    senderType: 'admin',
    createdAt: '2023-02-25T14:20:00Z',
    updatedAt: '2023-02-25T14:20:00Z',
    read: false
  },
  {
    id: 'msg-2',
    content: 'Nous avons besoin d\'informations supplémentaires',
    ticketId: 'TK-1233',
    senderId: 'admin-2',
    senderType: 'admin',
    createdAt: '2023-02-24T10:30:00Z',
    updatedAt: '2023-02-24T10:30:00Z',
    read: false
  },
  {
    id: 'msg-3',
    content: 'Ticket #TK-1234 créé avec succès',
    ticketId: 'TK-1234',
    senderId: 'system',
    senderType: 'system',
    createdAt: '2023-02-25T10:30:00Z',
    updatedAt: '2023-02-25T10:30:00Z',
    read: true
  }
];

export const users: User[] = [
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'admin-2',
    firstName: 'Support',
    lastName: 'Technique',
    email: 'support@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'client-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    role: 'client',
    createdAt: '2023-01-15T08:00:00Z'
  }
]; 