"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApi } from '@/hooks/use-api'
import { toast } from '@/components/ui/use-toast'
import { TicketStatus } from '@/types'

interface TicketStatusChangerProps {
  ticketId: string
  currentStatus: TicketStatus
  onStatusChange?: (newStatus: TicketStatus) => void
}

const statusMap = {
  'open': 'En attente',
  'in_progress': 'En cours',
  'closed': 'Résolu'
} as const;

export function TicketStatusChanger({ ticketId, currentStatus, onStatusChange }: TicketStatusChangerProps) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      setStatus(newStatus)
      onStatusChange?.(newStatus)
      
      // Afficher le toast de succès
      toast({
        title: "Statut mis à jour",
        description: "Le statut du ticket a été modifié avec succès.",
      })
      
      // Actualiser la page pour refléter les changements
      router.refresh()
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour le statut du ticket.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      defaultValue={status}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Changer le statut">
          {statusMap[status as keyof typeof statusMap] || status}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">En attente</SelectItem>
        <SelectItem value="in_progress">En cours</SelectItem>
        <SelectItem value="closed">Résolu</SelectItem>
      </SelectContent>
    </Select>
  )
} 