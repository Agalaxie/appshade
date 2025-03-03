"use client"

import React from 'react'
import Link from 'next/link'
import { ClientSidebar } from '@/components/client-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketIcon, MessageSquareIcon, ClockIcon } from 'lucide-react'
import { useApi } from '@/hooks/use-api'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Ticket, Message } from '@/types'

interface TicketWithMessages extends Ticket {
  messages?: Message[]
}

interface MessageWithTicketTitle extends Message {
  ticketTitle: string
}

export default function ClientDashboardPage() {
  const {
    data: tickets,
    loading: ticketsLoading,
    error: ticketsError
  } = useApi<TicketWithMessages[]>('/api/tickets')

  // Calculer les statistiques
  const activeTickets = tickets?.filter((ticket: TicketWithMessages) => ticket.status !== 'closed')?.length || 0
  const unreadMessages = tickets?.reduce((count: number, ticket: TicketWithMessages) => 
    count + (ticket.messages?.filter((msg: Message) => !msg.read)?.length || 0), 0) || 0

  return (
    <SidebarProvider defaultCollapsed={false} collapsible="expanded">
      <ClientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Tableau de bord</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets actifs</CardTitle>
                <TicketIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTickets}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages non lus</CardTitle>
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadMessages}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps de réponse moyen</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">~2h</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Tickets récents</CardTitle>
                <CardDescription>
                  Vos tickets les plus récents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between rounded-md border p-3">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                        <Skeleton className="h-6 w-[80px]" />
                      </div>
                    ))}
                  </div>
                ) : ticketsError ? (
                  <div className="text-center text-sm text-muted-foreground">
                    Une erreur est survenue lors du chargement des tickets
                  </div>
                ) : tickets && tickets.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {tickets.slice(0, 3).map((ticket: TicketWithMessages) => (
                      <Link
                        href={`/client/tickets/${ticket.id}`}
                        key={ticket.id}
                        className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between rounded-md border p-3">
                          <div>
                            <div className="font-medium">{ticket.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(ticket.createdAt)}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              ticket.status === 'in_progress' 
                                ? 'bg-blue-50 text-blue-700' 
                                : ticket.status === 'open'
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-green-50 text-green-700'
                            }`}>
                              {ticket.status === 'open' ? 'En attente' : 
                               ticket.status === 'in_progress' ? 'En cours' : 'Fermé'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    Aucun ticket récent
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Messages récents</CardTitle>
                <CardDescription>
                  Vos derniers messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col gap-1 rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-[100px]" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : ticketsError ? (
                  <div className="text-center text-sm text-muted-foreground">
                    Une erreur est survenue lors du chargement des messages
                  </div>
                ) : tickets && tickets.some((t: TicketWithMessages) => (t.messages || []).length > 0) ? (
                  <div className="space-y-2">
                    {tickets
                      .flatMap((ticket: TicketWithMessages) => 
                        (ticket.messages || []).map((msg: Message) => ({
                          ...msg,
                          ticketTitle: ticket.title
                        }))
                      )
                      .sort((a: MessageWithTicketTitle, b: MessageWithTicketTitle) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      )
                      .slice(0, 3)
                      .map((message: MessageWithTicketTitle) => (
                        <div key={message.id} className="flex flex-col gap-1 rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {message.senderType === 'admin' ? 'Support' : 'Système'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(message.createdAt)}
                            </div>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <div className="text-xs text-muted-foreground">
                            Re: {message.ticketTitle}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    Aucun message récent
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 