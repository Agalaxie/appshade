"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { MessageCard } from '@/components/message-card'
import { ArrowLeftIcon, SendIcon, UserIcon, EditIcon, Trash2 } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import { Ticket, Message } from '@/types'
import { useApi, clearApiCache } from '@/hooks/use-api'
import { logger } from '@/lib/logger'
import { TicketAttachments } from '@/components/ticket-attachments'
import { AccessInfoCard } from "@/components/access-info-card"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageInput } from "@/components/message-input"
import { toast } from "@/components/ui/use-toast"

export default function AdminTicketDetailPage({ params }: { params: { id: string } }) {
  const [newMessage, setNewMessage] = useState('')
  const router = useRouter()
  
  // S'assurer que l'ID est défini
  if (!params.id) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">ID du ticket manquant</p>
        <Button asChild>
          <Link href="/admin/tickets">Retour aux tickets</Link>
        </Button>
      </div>
    )
  }

  const ticketUrl = `/api/tickets/${params.id}`
  const messagesUrl = `/api/tickets/${params.id}/messages`
  
  const {
    data: ticket,
    error: ticketError,
    loading: ticketLoading,
    refetch: refetchTicket
  } = useApi<Ticket>(ticketUrl)

  const {
    data: messages,
    error: messagesError,
    loading: messagesLoading,
    refetch: refetchMessages
  } = useApi<Message[]>(messagesUrl)

  // Gérer le chargement
  if (ticketLoading || messagesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  // Gérer les erreurs
  if (ticketError || messagesError) {
    logger.error('Erreur de chargement:', {
      ticketError,
      messagesError,
      ticketId: params.id
    });

    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link href="/admin/tickets">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
            </div>
          </header>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des données.</p>
            <p className="text-sm text-gray-500 mb-4">
              {ticketError || messagesError}
            </p>
            <Button onClick={() => {
              refetchTicket()
              refetchMessages()
            }}>Réessayer</Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Si pas de ticket trouvé
  if (!ticket) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link href="/admin/tickets">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
            </div>
          </header>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Ticket non trouvé.</p>
            <Button asChild>
              <Link href="/admin/tickets">Retour aux tickets</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const statusMap: Record<string, string> = {
    'open': 'En attente',
    'in_progress': 'En cours',
    'closed': 'Fermé'
  }

  const priorityMap: Record<string, string> = {
    'low': 'Basse',
    'medium': 'Moyenne',
    'high': 'Haute',
    'urgent': 'Urgente'
  }

  const categoryMap: Record<string, string> = {
    'technical': 'Problème technique',
    'billing': 'Facturation',
    'account': 'Compte',
    'feature': 'Demande de fonctionnalité',
    'other': 'Autre'
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message')
      }

      // Réinitialiser le champ de message et rafraîchir les messages
      setNewMessage('')
      refetchMessages()
    } catch (error) {
      logger.error('Erreur lors de l\'envoi du message:', error)
      // Gérer l'erreur (afficher une notification, etc.)
    }
  }

  const handleDeleteTicket = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du ticket');
      }

      // Invalider le cache pour forcer un rafraîchissement des listes de tickets
      clearApiCache('/api/tickets');

      toast({
        title: "Ticket supprimé",
        description: "Le ticket a été supprimé avec succès",
      });
      
      router.push('/admin/tickets');
    } catch (error) {
      logger.error('Erreur lors de la suppression du ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/admin/tickets">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Ticket #{ticket.id}</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <EditIcon className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button variant="outline" size="sm">
                Assigner
              </Button>
              <Button variant="outline" size="sm" className={
                ticket.status === 'open' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                'bg-green-50 text-green-700 hover:bg-green-100'
              }>
                {statusMap[ticket.status]}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteTicket}>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{ticket.title}</CardTitle>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <CardDescription>
                    Créé le {formatDate(ticket.createdAt)} • Dernière mise à jour le {formatDate(ticket.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{ticket.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <h3 className="text-sm font-medium">Priorité</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{priorityMap[ticket.priority]}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Catégorie</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{categoryMap[ticket.category]}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Assigné à</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ticket.assignedToId ? 'Support technique' : 'Non assigné'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages?.map((message, index) => (
                      <MessageCard key={message.id} message={message} index={index} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <MessageInput
                      value={newMessage}
                      onChange={setNewMessage}
                      onSend={handleSendMessage}
                      placeholder="Écrivez votre message..."
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations client</CardTitle>
                </CardHeader>
                <CardContent>
                  {ticket?.user && (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{ticket.user.firstName} {ticket.user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{ticket.user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {ticket.user.company && (
                          <div>
                            <h3 className="text-sm font-medium">Entreprise</h3>
                            <p className="text-sm text-muted-foreground">{ticket.user.company}</p>
                          </div>
                        )}
                        {ticket.user.phoneNumber && (
                          <div>
                            <h3 className="text-sm font-medium">Téléphone</h3>
                            <p className="text-sm text-muted-foreground">{ticket.user.phoneNumber}</p>
                          </div>
                        )}
                        {ticket.user.address && (
                          <div>
                            <h3 className="text-sm font-medium">Adresse</h3>
                            <p className="text-sm text-muted-foreground">
                              {ticket.user.address}<br />
                              {ticket.user.postalCode} {ticket.user.city}<br />
                              {ticket.user.country}
                            </p>
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-medium">Client depuis</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(ticket.user.createdAt)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/admin/clients/${ticket?.user?.id}`}>
                      Voir le profil complet
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations d'accès</CardTitle>
                </CardHeader>
                <CardContent>
                  <AccessInfoCard accessInfo={ticket} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pièces jointes</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketAttachments ticketId={params.id} isAdmin={true} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 