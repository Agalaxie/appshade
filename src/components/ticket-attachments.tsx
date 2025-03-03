"use client"

import React, { useState, useEffect } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Paperclip, FileText, Image as ImageIcon, X, Download } from 'lucide-react'
import { uploadFile, getTicketAttachments } from '@/lib/upload-service'
import { toast } from '@/components/ui/use-toast'

interface TicketAttachmentsProps {
  ticketId: string
  isAdmin?: boolean
  readOnly?: boolean
}

interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  filePath: string
  createdAt: string
}

export function TicketAttachments({ ticketId, isAdmin = false, readOnly = false }: TicketAttachmentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les pièces jointes existantes
  useEffect(() => {
    const loadAttachments = async () => {
      try {
        setIsLoading(true)
        const data = await getTicketAttachments(ticketId)
        setAttachments(data)
      } catch (error) {
        console.error('Erreur lors du chargement des pièces jointes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAttachments()
  }, [ticketId])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      const fileUrl = await uploadFile(selectedFile, ticketId)
      
      // Actualiser la liste des pièces jointes
      const data = await getTicketAttachments(ticketId)
      setAttachments(data)
      
      // Réinitialiser le fichier sélectionné
      setSelectedFile(null)
      
      toast({
        title: "Fichier téléchargé",
        description: "Le fichier a été téléchargé avec succès.",
      })
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error)
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (attachmentId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/attachments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attachmentId }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la pièce jointe')
      }

      // Actualiser la liste des pièces jointes
      setAttachments(attachments.filter(attachment => attachment.id !== attachmentId))
      
      toast({
        title: "Pièce jointe supprimée",
        description: "La pièce jointe a été supprimée avec succès.",
      })
    } catch (error) {
      console.error('Erreur lors de la suppression de la pièce jointe:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la pièce jointe.",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    }
    return <FileText className="h-5 w-5 text-blue-500" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Paperclip className="h-5 w-5" />
        <h3 className="text-lg font-medium">Pièces jointes</h3>
      </div>

      {!readOnly && (
        <div className="space-y-4">
          <FileUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFile={selectedFile}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            maxSizeMB={5}
          />
          
          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Téléchargement en cours...' : 'Télécharger le fichier'}
            </Button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement des pièces jointes...</p>
        ) : attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune pièce jointe</p>
        ) : (
          attachments.map(attachment => (
            <Card key={attachment.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(attachment.fileType)}
                  <div>
                    <p className="font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <a href={attachment.filePath} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  {(isAdmin || !readOnly) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 