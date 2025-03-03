// Configuration PayPal pour différents environnements
export const PAYPAL_CLIENT_ID = 'sb'; // Mode sandbox par défaut

// Options par défaut pour les boutons PayPal
export const PAYPAL_OPTIONS = {
  currency: 'EUR',
  intent: 'capture',
  'disable-funding': 'credit,card',
};

// Types d'abonnement disponibles
export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'basic-monthly',
    name: 'Basic',
    description: 'Plan de base pour les petites équipes',
    price: 29.99,
    features: [
      'Jusqu\'à 3 utilisateurs',
      'Jusqu\'à 100 tickets par mois',
      'Support par email',
    ],
    billingCycle: 'monthly',
  },
  PRO: {
    id: 'pro-monthly',
    name: 'Pro',
    description: 'Plan professionnel pour les équipes moyennes',
    price: 79.99,
    features: [
      'Jusqu\'à 10 utilisateurs',
      'Tickets illimités',
      'Support prioritaire',
      'Rapports avancés',
    ],
    billingCycle: 'monthly',
  },
  ENTERPRISE: {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    description: 'Plan entreprise pour les grandes équipes',
    price: 199.99,
    features: [
      'Utilisateurs illimités',
      'Tickets illimités',
      'Support dédié 24/7',
      'API personnalisée',
      'Intégrations avancées',
    ],
    billingCycle: 'monthly',
  },
}; 