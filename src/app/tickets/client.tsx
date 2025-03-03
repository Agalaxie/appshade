"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";

// Types temporaires - à remplacer par vos types réels
type TicketStatus = "todo" | "in-progress" | "backlog" | "done" | "canceled";
type TicketPriority = "low" | "medium" | "high";

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
}

// Données temporaires - à remplacer par vos données réelles
const MOCK_TICKETS: Ticket[] = [
  {
    id: "TICKET-1001",
    title: "Problème de connexion à l'application",
    status: "in-progress",
    priority: "high",
    type: "Bug",
    createdAt: new Date("2025-02-25"),
    updatedAt: new Date("2025-02-26"),
    description: "Les utilisateurs ne peuvent pas se connecter à l'application"
  },
  {
    id: "TICKET-1002",
    title: "Ajouter une fonctionnalité d'export PDF",
    status: "todo",
    priority: "medium",
    type: "Feature",
    createdAt: new Date("2025-02-24"),
    updatedAt: new Date("2025-02-24"),
    description: "Les utilisateurs souhaitent pouvoir exporter leurs données en PDF"
  },
  {
    id: "TICKET-1003",
    title: "Optimiser les performances de la page d'accueil",
    status: "backlog",
    priority: "medium",
    type: "Enhancement",
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-02-21"),
    description: "La page d'accueil est lente à charger"
  },
  {
    id: "TICKET-1004",
    title: "Corriger les erreurs de validation du formulaire",
    status: "done",
    priority: "high",
    type: "Bug",
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-18"),
    description: "Les messages d'erreur ne s'affichent pas correctement"
  },
  {
    id: "TICKET-1005",
    title: "Mettre à jour la documentation API",
    status: "canceled",
    priority: "low",
    type: "Documentation",
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-12"),
    description: "La documentation API n'est pas à jour"
  },
];

// Fonction pour obtenir l'icône et la couleur en fonction du statut
function getStatusInfo(status: TicketStatus) {
  switch (status) {
    case "todo":
      return { icon: <Clock className="h-4 w-4" />, label: "À faire" };
    case "in-progress":
      return { icon: <Clock className="h-4 w-4" />, label: "En cours" };
    case "backlog":
      return { icon: <AlertCircle className="h-4 w-4" />, label: "En attente" };
    case "done":
      return { icon: <CheckCircle2 className="h-4 w-4" />, label: "Terminé" };
    case "canceled":
      return { icon: <AlertCircle className="h-4 w-4" />, label: "Annulé" };
    default:
      return { icon: <Clock className="h-4 w-4" />, label: "Inconnu" };
  }
}

// Fonction pour obtenir la couleur en fonction de la priorité
function getPriorityInfo(priority: TicketPriority) {
  switch (priority) {
    case "high":
      return { icon: "↑", label: "Haute" };
    case "medium":
      return { icon: "→", label: "Moyenne" };
    case "low":
      return { icon: "↓", label: "Basse" };
    default:
      return { icon: "→", label: "Moyenne" };
  }
}

export function TicketsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  
  // Filtrer les tickets en fonction des critères
  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    // Filtre par recherche
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par statut
    const matchesStatus = selectedStatus ? ticket.status === selectedStatus : true;
    
    // Filtre par priorité
    const matchesPriority = selectedPriority ? ticket.priority === selectedPriority : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos tickets de support
          </p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau ticket
          </Link>
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex items-center gap-2">
        <div className="grow">
          <Input
            placeholder="Filtrer les tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Statut</span>
        </Button>
        
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span>Priorité</span>
        </Button>
        
        <Button variant="outline" size="sm" className="h-8">
          <span>Vue</span>
        </Button>
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-12 border-b px-4 py-3 font-medium">
          <div className="col-span-1">
            <input type="checkbox" className="rounded border-gray-300" />
          </div>
          <div className="col-span-5">
            <div className="flex items-center gap-2">
              Titre
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              Statut
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              Priorité
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              Type
            </div>
          </div>
        </div>
        
        {filteredTickets.map((ticket) => {
          const statusInfo = getStatusInfo(ticket.status);
          const priorityInfo = getPriorityInfo(ticket.priority);
          
          return (
            <div 
              key={ticket.id}
              className="grid grid-cols-12 items-center border-b px-4 py-3 hover:bg-muted/50"
            >
              <div className="col-span-1">
                <input type="checkbox" className="rounded border-gray-300" />
              </div>
              <div className="col-span-5">
                <Link href={`/tickets/${ticket.id}`} className="font-medium hover:underline">
                  {ticket.title}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {ticket.id}
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={ticket.status}>
                    <div className="flex items-center gap-1">
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                  </StatusBadge>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Badge variant={ticket.priority === "high" ? "destructive" : ticket.priority === "low" ? "outline" : "secondary"}>
                    <div className="flex items-center gap-1">
                      <span>{priorityInfo.icon}</span>
                      <span>{priorityInfo.label}</span>
                    </div>
                  </Badge>
                </div>
              </div>
              <div className="col-span-1">
                <Badge variant="outline">{ticket.type}</Badge>
              </div>
              <div className="col-span-1 text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        
        {filteredTickets.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            Aucun ticket trouvé.
          </div>
        )}
      </div>
    </div>
  );
} 