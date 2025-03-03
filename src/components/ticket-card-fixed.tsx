"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Ticket, TicketStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TicketStatusWrapper } from './ticket-status-wrapper';

interface TicketCardProps {
  ticket: Ticket;
  showClient?: boolean;
  isAdmin?: boolean;
  href: string;
}

export function TicketCard({ ticket, showClient = false, isAdmin = false, href }: TicketCardProps) {
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket.status as TicketStatus);
  
  const statusMap: Record<string, string> = {
    'open': 'En attente',
    'in_progress': 'En cours',
    'closed': 'Fermé'
  };

  const priorityMap: Record<string, string> = {
    'low': 'Basse',
    'medium': 'Moyenne',
    'high': 'Haute',
    'urgent': 'Urgente'
  };

  const basePath = isAdmin ? '/admin' : '/client';

  // Fonction pour obtenir l'icône en fonction du statut
  const getStatusIcon = (status: string) => {
    if (status === 'open') {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else if (status === 'in_progress') {
      return <Clock className="h-5 w-5 text-blue-500" />;
    } else {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  // Fonction pour obtenir la classe CSS du badge en fonction du statut
  const getStatusBadgeClass = (status: string) => {
    if (status === 'open') {
      return 'bg-yellow-500/10 text-yellow-500';
    } else if (status === 'in_progress') {
      return 'bg-blue-500/10 text-blue-500';
    } else {
      return 'bg-green-500/10 text-green-500';
    }
  };

  // Create a type-safe handler function
  const handleStatusChange = (newStatus: TicketStatus) => {
    setCurrentStatus(newStatus);
  };

  return (
    <div className="group relative">
      <Link 
        href={href}
        className="block transition-colors hover:bg-accent/50 rounded-lg"
      >
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-base">{ticket.title}</h2>
                {ticket.priority === 'high' && (
                  <Badge variant="destructive" className="font-normal">
                    Urgent
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className={`font-normal ${getStatusBadgeClass(currentStatus)}`}
                >
                  {statusMap[currentStatus] || currentStatus}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ticket.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(ticket.createdAt)}
                </div>
                {showClient && ticket.clientName && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Client:</span>
                    {ticket.clientName}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {getStatusIcon(currentStatus)}
            </div>
          </div>
        </Card>
      </Link>
      {isAdmin && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TicketStatusWrapper
            ticketId={ticket.id}
            initialStatus={currentStatus}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
} 