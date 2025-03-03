"use client"

import React from 'react';
import Link from 'next/link';
import { Ticket } from '@/types';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  showClient?: boolean;
  isAdmin?: boolean;
  href: string;
}

export function TicketCard({ ticket, showClient = false, isAdmin = false, href }: TicketCardProps) {
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
                <Badge variant="outline" className="font-normal">
                  {ticket.status}
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
          </div>
        </Card>
      </Link>
    </div>
  );
} 