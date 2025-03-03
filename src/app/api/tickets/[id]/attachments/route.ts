import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import logger from '@/lib/logger'

// Initialiser Prisma
const prisma = new PrismaClient({
  log: ['error'],
})

// Dossier pour stocker les fichiers
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

// GET /api/tickets/[id]/attachments - Récupérer les pièces jointes d'un ticket
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID utilisateur de Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: ticketId } = params

    // Récupérer les pièces jointes du ticket
    const attachments = await prisma.attachment.findMany({
      where: {
        ticketId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ attachments })
  } catch (error) {
    logger.error('Erreur lors de la récupération des pièces jointes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/tickets/[id]/attachments - Ajouter une pièce jointe à un ticket
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID utilisateur de Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: ticketId } = params
    const { fileName, fileType, fileSize, fileData } = await req.json()

    // Vérifier que les données sont valides
    if (!fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Vérifier que le ticket existe
    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket non trouvé' }, { status: 404 })
    }

    // Vérifier que l'utilisateur est autorisé à ajouter une pièce jointe
    if (ticket.userId !== userId) {
      // Vérifier si l'utilisateur est un admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      const isAdmin = user?.role === 'admin'

      if (!isAdmin) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    // Générer un nom de fichier unique
    const fileExtension = fileName.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = path.join(UPLOAD_DIR, uniqueFileName)
    const fileUrl = `/uploads/${uniqueFileName}`

    // Extraire les données base64
    const base64Data = fileData.split(';base64,').pop()
    
    // Écrire le fichier sur le disque
    fs.writeFileSync(filePath, base64Data, { encoding: 'base64' })

    // Enregistrer la pièce jointe dans la base de données
    const attachment = await prisma.attachment.create({
      data: {
        fileName,
        fileType,
        fileSize,
        filePath: fileUrl,
        ticketId,
        userId,
      },
    })

    return NextResponse.json({
      attachment,
      fileUrl,
    })
  } catch (error) {
    logger.error('Erreur lors de l\'ajout d\'une pièce jointe:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/tickets/[id]/attachments - Supprimer une pièce jointe
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID utilisateur de Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id: ticketId } = params
    const { attachmentId } = await req.json()

    if (!attachmentId) {
      return NextResponse.json({ error: 'ID de pièce jointe manquant' }, { status: 400 })
    }

    // Récupérer la pièce jointe
    const attachment = await prisma.attachment.findUnique({
      where: {
        id: attachmentId,
      },
      include: {
        ticket: true,
      },
    })

    if (!attachment) {
      return NextResponse.json({ error: 'Pièce jointe non trouvée' }, { status: 404 })
    }

    // Vérifier que l'utilisateur est autorisé à supprimer la pièce jointe
    if (attachment.userId !== userId && attachment.ticket.userId !== userId) {
      // Vérifier si l'utilisateur est un admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      const isAdmin = user?.role === 'admin'

      if (!isAdmin) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
      }
    }

    // Supprimer le fichier du disque
    const filePath = path.join(process.cwd(), 'public', attachment.filePath)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Supprimer la pièce jointe de la base de données
    await prisma.attachment.delete({
      where: {
        id: attachmentId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Erreur lors de la suppression d\'une pièce jointe:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 