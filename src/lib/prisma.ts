import { PrismaClient } from '@prisma/client';

// Déclaration pour éviter de créer plusieurs instances en développement
declare global {
  var prisma: PrismaClient | undefined;
}

// Création d'une instance PrismaClient
export const prisma = global.prisma || new PrismaClient();

// En développement, on attache l'instance à l'objet global pour éviter les duplications
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; 