export const TICKET_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
};

export const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TICKET_CATEGORIES = [
  { value: 'technical', label: 'Problème technique' },
  { value: 'billing', label: 'Facturation' },
  { value: 'account', label: 'Compte' },
  { value: 'feature', label: 'Demande de fonctionnalité' },
  { value: 'other', label: 'Autre' },
];

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
}; 