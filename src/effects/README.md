# Effets visuels pour AppShade

Ce dossier contient différents effets visuels qui peuvent être utilisés dans l'application AppShade.

## Effets disponibles

### FireworksBackground

Un effet de feux d'artifice spectaculaire avec des explosions de particules et un fond animé.

**Caractéristiques :**
- Feux d'artifice qui montent et explosent à différentes hauteurs
- Entre 150 et 300 particules par explosion
- Effet de double explosion pour 30% des feux d'artifice
- 500 particules d'ambiance en arrière-plan
- Couleurs : blanc et jaune (couleur du thème)

**Utilisation :**
```tsx
import { FireworksBackground } from "@/effects/fireworks-background";

// Dans votre composant
return (
  <>
    <FireworksBackground />
    {/* Reste de votre contenu */}
  </>
);
```

## Comment ajouter un nouvel effet

1. Créez un nouveau fichier dans ce dossier avec un nom descriptif
2. Implémentez votre effet en tant que composant React
3. Exportez le composant
4. Mettez à jour ce README avec les informations sur votre nouvel effet 