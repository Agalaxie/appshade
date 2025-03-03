# Système de Tickets pour Support Technique

Un système de gestion de tickets moderne pour le support technique, construit avec Next.js, TypeScript, Tailwind CSS et shadcn/ui.

## Fonctionnalités

- **Interface Client**
  - Tableau de bord avec statistiques
  - Création de nouveaux tickets
  - Suivi des tickets existants
  - Messagerie avec le support

- **Interface Admin**
  - Tableau de bord avec statistiques avancées
  - Gestion de tous les tickets
  - Gestion des clients
  - Analytiques et rapports

## Structure du Projet

Le projet est organisé comme suit :

```
src/
├── app/
│   ├── admin/           # Interface administrateur
│   ├── client/          # Interface client
│   │   ├── tickets/     # Gestion des tickets côté client
│   │   └── messages/    # Messagerie côté client
│   └── page.tsx         # Page d'accueil
├── components/          # Composants réutilisables
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── admin-sidebar.tsx # Sidebar pour l'interface admin
│   └── client-sidebar.tsx # Sidebar pour l'interface client
└── lib/                 # Utilitaires et fonctions
```

## Technologies Utilisées

- **Next.js** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Lucide Icons** - Icônes

## Installation

1. Clonez le dépôt
2. Installez les dépendances avec `npm install`
3. Lancez le serveur de développement avec `npm run dev`

## Captures d'écran

*À venir*

## Licence

MIT 