"use client"

import { useState } from 'react'
import { TicketStatus } from '@/types'
import { TicketStatusChanger } from './ticket-status-changer'

interface TicketStatusWrapperProps {
  ticketId: string
  initialStatus: TicketStatus
  onStatusChange?: (newStatus: TicketStatus) => void
}

export function TicketStatusWrapper({ 
  ticketId, 
  initialStatus, 
  onStatusChange 
}: TicketStatusWrapperProps) {
  const [status, setStatus] = useState<TicketStatus>(initialStatus)

  const handleStatusChange = (newStatus: TicketStatus) => {
    setStatus(newStatus)
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }

  return (
    <TicketStatusChanger
      ticketId={ticketId}
      currentStatus={status}
      onStatusChange={handleStatusChange}
    />
  )
} 