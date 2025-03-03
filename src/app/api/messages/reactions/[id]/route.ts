import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/messages/reactions/[id] - Supprimer une réaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const reactionId = params.id;
    
    // Vérifier si la réaction existe
    const reaction = await prisma.messageReaction.findUnique({
      where: { id: reactionId }
    });
    
    if (!reaction) {
      return NextResponse.json({ error: 'Réaction non trouvée' }, { status: 404 });
    }
    
    // Vérifier si l'utilisateur est autorisé à supprimer cette réaction
    if (reaction.userId !== userId) {
      return NextResponse.json({ error: 'Non autorisé à supprimer cette réaction' }, { status: 403 });
    }
    
    // Supprimer la réaction
    await prisma.messageReaction.delete({
      where: { id: reactionId }
    });
    
    return NextResponse.json({ message: 'Réaction supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réaction:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
