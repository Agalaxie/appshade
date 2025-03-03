"use client"

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  selectedFile?: File | null
  previewUrl?: string | null
  className?: string
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  previewUrl,
  className,
  accept = "image/*",
  maxSizeMB = 5
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(previewUrl || null)
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Vérifier la taille du fichier
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB`)
      return false
    }
    
    // Vérifier le type de fichier si accept est spécifié
    if (accept && accept !== "*") {
      const fileType = file.type
      const acceptTypes = accept.split(",").map(type => type.trim())
      
      // Si accept contient image/*, vérifier si le type commence par "image/"
      const isAccepted = acceptTypes.some(type => {
        if (type === "image/*" && fileType.startsWith("image/")) return true
        if (type === fileType) return true
        return false
      })
      
      if (!isAccepted) {
        setError(`Type de fichier non accepté. Types acceptés: ${accept}`)
        return false
      }
    }
    
    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        handleFile(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        handleFile(file)
      }
    }
  }

  const handleFile = (file: File) => {
    // Créer une URL pour la prévisualisation
    const fileUrl = URL.createObjectURL(file)
    setLocalPreviewUrl(fileUrl)
    
    // Appeler le callback
    onFileSelect(file)
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setLocalPreviewUrl(null)
    setError(null)
    onFileRemove?.()
  }

  const isImage = selectedFile?.type.startsWith('image/') || (localPreviewUrl && !selectedFile?.type.startsWith('application/'))

  return (
    <div className={cn("w-full", className)}>
      {!localPreviewUrl ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
            dragActive 
              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" 
              : "border-gray-200 dark:border-gray-800 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
            error ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-yellow-500 dark:text-yellow-400" />
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept === "image/*" ? "PNG, JPG ou GIF" : "Tous types de fichiers"} (max. {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full border rounded-lg overflow-hidden border-gray-200 dark:border-gray-800">
          {isImage ? (
            <div className="relative aspect-video bg-gray-50 dark:bg-gray-900">
              <img
                src={localPreviewUrl}
                alt="Aperçu"
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center p-4 gap-3">
              <FileText className="w-8 h-8 text-yellow-500" />
              <div className="flex-1 truncate">
                <p className="font-medium truncate">{selectedFile?.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile?.size && (selectedFile.size / 1024 / 1024).toFixed(2)) || "?"} MB
                </p>
              </div>
            </div>
          )}
          
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 