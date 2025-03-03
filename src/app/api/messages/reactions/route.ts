import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST /api/messages/reactions - Ajouter une réaction
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const { messageId, emoji } = await req.json();
    
    if (!messageId || !emoji) {
      return NextResponse.json({ error: 'messageId et emoji sont requis' }, { status: 400 });
    }
    
    // Vérifier si le message existe
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { ticket: true }
    });
    
    if (!message) {
      return NextResponse.json({ error: 'Message non trouvé' }, { status: 404 });
    }
    
    // Vérifier si l'utilisateur a déjà réagi avec cet emoji
    const existingReaction = await prisma.messageReaction.findFirst({
      where: {
        messageId,
        userId,
        emoji
      }
    });
    
    if (existingReaction) {
      // Si la réaction existe déjà, on la supprime (toggle)
      await prisma.messageReaction.delete({
        where: { id: existingReaction.id }
      });
      
      return NextResponse.json({ 
        message: 'Réaction supprimée',
        id: existingReaction.id
      });
    }
    
    // Créer la réaction
    const reaction = await prisma.messageReaction.create({
      data: {
        emoji,
        messageId,
        userId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    // Formater la réponse
    const formattedReaction = {
      id: reaction.id,
      emoji: reaction.emoji,
      userId: reaction.userId,
      messageId: reaction.messageId,
      createdAt: reaction.createdAt,
      userName: reaction.user.firstName 
        ? `${reaction.user.firstName} ${reaction.user.lastName || ''}`
        : undefined
    };
    
    return NextResponse.json(formattedReaction);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réaction:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 