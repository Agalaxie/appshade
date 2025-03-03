// Script pour tester les variables d'environnement
require('dotenv').config({ path: '.env.local' });

console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Défini (valeur masquée)' : 'Non défini'); 