export type TicketStatus = 'open' | 'in_progress' | 'closed'

// Keep the Status type for backward compatibility
export type Status = TicketStatus

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'admin' | 'client';
  company?: string;
  position?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clientId?: string;
  clientName?: string;
  assignedToId?: string;
  ftpHost?: string;
  ftpPort?: string;
  ftpUsername?: string;
  ftpPassword?: string;
  cmsType?: string;
  cmsUrl?: string;
  cmsUsername?: string;
  cmsPassword?: string;
  hostingProvider?: string;
  hostingPlan?: string;
  user?: User;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  ticketId: string;
  senderId: string;
  senderType: 'client' | 'admin' | 'system';
  createdAt: string;
  read: boolean;
  updatedAt: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  userName?: string;
  createdAt: string;
} 