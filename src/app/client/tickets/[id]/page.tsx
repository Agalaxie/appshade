"use client"

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClientSidebar } from "@/components/client-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { useApi, useMutation } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { TicketAttachments } from "@/components/ticket-attachments";
import { toast as useToastToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { MessageInput } from "@/components/message-input";
import { MessageCard } from "@/components/message-card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

// Fonction pour formater la date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Fonction pour obtenir la couleur du badge de statut
function getStatusBadge(status: string) {
  switch (status) {
    case "open":
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">En attente</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-500">En cours</Badge>;
    case "closed":
      return <Badge variant="outline" className="bg-green-500/10 text-green-500">Résolu</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// Fonction pour obtenir la couleur du badge de priorité
function getPriorityBadge(priority: string) {
  switch (priority) {
    case "low":
      return <Badge variant="outline">Basse</Badge>;
    case "medium":
      return <Badge variant="secondary">Moyenne</Badge>;
    case "high":
      return <Badge variant="destructive">Haute</Badge>;
    case "urgent":
      return <Badge variant="destructive">Urgente</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const [newMessage, setNewMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Récupérer les détails du ticket
  const {
    data: ticket,
    loading: ticketLoading,
    error: ticketError,
    refetch,
  } = useApi(`/api/tickets/${params.id}`);

  // Récupérer les messages du ticket
  const {
    data: messages,
    error: messagesError,
    loading: messagesLoading,
    refetch: mutateMessages,
  } = useApi(`/api/tickets/${params.id}/messages`);

  // Mutation pour envoyer un nouveau message
  const { mutate: sendMessage, loading: sendingMessage } = useMutation(
    `/api/tickets/${params.id}/messages`,
    "POST"
  );

  // Mutation pour supprimer le ticket
  const { mutate: deleteTicket, loading: deletingTicket } = useMutation(
    `/api/tickets/${params.id}`,
    "DELETE"
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessage({ content: newMessage })
      .then(() => {
        setNewMessage("");
        mutateMessages();
        toast.success("Message envoyé avec succès");
      })
      .catch((error) => {
        console.error("Erreur détaillée:", error);
        toast.error(error.message || "Erreur lors de l'envoi du message");
      });
  };

  const handleDeleteTicket = async () => {
    setIsDeleting(true);
    
    try {
      // Afficher un toast de chargement
      toast.loading("Suppression du ticket en cours...");
      
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }
      
      // Suppression réussie
      toast.success("Le ticket a été supprimé avec succès.");
      
      // Attendre un peu pour que le toast s'affiche avant la redirection
      setTimeout(() => {
        router.push('/client/tickets');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error);
      
      // Afficher un toast d'erreur
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du ticket.");
      
      setIsDeleting(false);
    }
  };

  if (ticketLoading) {
    return (
      <SidebarProvider>
        <ClientSidebar />
        <SidebarInset>
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (ticketError || !ticket) {
    return (
      <SidebarProvider>
        <ClientSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link href="/client/tickets">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
            </div>
          </header>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">
              Impossible de charger les détails du ticket. Veuillez réessayer plus tard.
            </p>
            <Button asChild>
              <Link href="/client/tickets">Retour aux tickets</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link href="/client/tickets">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{ticket.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Ticket #{ticket.id} • {formatDate(ticket.createdAt)}
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteTicket}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{ticket.title}</CardTitle>
                    {getStatusBadge(ticket.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{ticket.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <h3 className="text-sm font-medium">Priorité</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ticket.priority === "low"
                          ? "Basse"
                          : ticket.priority === "medium"
                          ? "Moyenne"
                          : ticket.priority === "high"
                          ? "Haute"
                          : "Urgente"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Créé le</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(ticket.createdAt)}
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
                  {messagesLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : messagesError ? (
                    <p className="text-red-500">
                      Impossible de charger les messages. Veuillez réessayer plus tard.
                    </p>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message: any, index: number) => (
                        <MessageCard key={message.id} message={message} index={index} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun message pour le moment.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-4">
                    <MessageInput
                      value={newMessage}
                      onChange={setNewMessage}
                      onSend={handleSendMessage}
                      placeholder="Écrivez votre message ici..."
                      disabled={sendingMessage}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Statut</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.status === "open"
                          ? "En attente"
                          : ticket.status === "in_progress"
                          ? "En cours"
                          : "Résolu"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Catégorie</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.category === "technical"
                          ? "Problème technique"
                          : ticket.category === "billing"
                          ? "Facturation"
                          : ticket.category === "account"
                          ? "Compte"
                          : ticket.category === "feature"
                          ? "Demande de fonctionnalité"
                          : "Autre"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Dernière mise à jour</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(ticket.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Composant de pièces jointes déplacé sous les informations du ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Pièces jointes</CardTitle>
                </CardHeader>
                <CardContent>
                  <TicketAttachments ticketId={params.id as string} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 