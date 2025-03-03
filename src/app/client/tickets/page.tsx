"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClientSidebar } from '@/components/client-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Badge } from '@/components/ui/badge'
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Menu,
  X
} from "lucide-react"
import { useApi } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

// Fonction pour formater la date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Fonction pour obtenir l'icône et le label en fonction du statut
function getStatusInfo(status: string) {
  switch (status) {
    case "open":
      return { icon: <AlertCircle className="h-4 w-4" />, label: "En attente" }
    case "in_progress":
      return { icon: <Clock className="h-4 w-4" />, label: "En cours" }
    case "closed":
      return { icon: <CheckCircle2 className="h-4 w-4" />, label: "Fermé" }
    default:
      return { icon: <Clock className="h-4 w-4" />, label: status }
  }
}

// Fonction pour obtenir la couleur en fonction de la priorité
function getPriorityInfo(priority: string) {
  switch (priority) {
    case "high":
      return { icon: "↑", label: "Haute" }
    case "medium":
      return { icon: "→", label: "Moyenne" }
    case "low":
      return { icon: "↓", label: "Basse" }
    default:
      return { icon: "→", label: priority || "Moyenne" }
  }
}

// Définition d'une interface pour les tickets
interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  description: string;
  messages?: Array<{
    id: string;
    sender: string;
    content: string;
    createdAt: string;
  }>;
}

export default function ClientTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  })
  
  // Vérifier si le paramètre demo est présent dans l'URL
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isDemo = urlParams.get('demo') === 'true';
  
  // Utiliser l'API pour récupérer les tickets réels ou utiliser les exemples
  const { data: apiTickets, error, loading, refetch } = useApi(isDemo ? '/api/tickets?demo=true' : '/api/tickets');
  
  // Combiner les tickets de l'API avec les exemples
  const allTickets = React.useMemo(() => {
    const realTickets = apiTickets || [];
    // Ne plus utiliser les tickets d'exemple
    return realTickets;
  }, [apiTickets]);

  // Filtrer les tickets en fonction des critères
  const filteredTickets = allTickets ? allTickets.filter((ticket: Ticket) => {
    // Filtre par recherche
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filtre par statut
    const matchesStatus = statusFilter === 'all' ? true : ticket.status === statusFilter
    
    return matchesSearch && matchesStatus;
  }) : []

  const handleCreateTicket = () => {
    // Dans un environnement réel, vous enverriez ces données à votre API
    console.log('Création du ticket:', newTicket);
    
    // Simuler l'ajout d'un nouveau ticket
    const newTicketData = {
      id: `TK-${Math.floor(Math.random() * 10000)}`,
      title: newTicket.title,
      description: newTicket.description,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      messages: []
    };
    
    // Fermer la modal et réinitialiser le formulaire
    setIsCreateModalOpen(false);
    setNewTicket({
      title: '',
      description: '',
      priority: 'medium'
    });
    
    // Rafraîchir la liste des tickets
    refetch();
  }

  const router = useRouter()

  return (
    <SidebarProvider defaultCollapsed={true} collapsible="expanded">
      <ClientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="h-9 w-9 p-0" />
            <h1 className="text-xl font-semibold">Mes tickets</h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <Input 
                placeholder="Rechercher un ticket..." 
                className="w-full md:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
                >
                  Tous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('open')}
                  className={statusFilter === 'open' ? 'bg-primary text-primary-foreground' : ''}
                >
                  En attente
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('in_progress')}
                  className={statusFilter === 'in_progress' ? 'bg-primary text-primary-foreground' : ''}
                >
                  En cours
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('closed')}
                  className={statusFilter === 'closed' ? 'bg-primary text-primary-foreground' : ''}
                >
                  Fermés
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden md:inline">Actualiser</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/client/tickets?demo=true'}
                className="flex items-center gap-1"
              >
                <span className="hidden md:inline">Charger démo</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer TOUS les tickets ? Cette action est irréversible.')) {
                    toast.loading('Suppression de tous les tickets...');
                    try {
                      const response = await fetch('/api/tickets', {
                        method: 'OPTIONS'
                      });
                      
                      if (!response.ok) {
                        throw new Error('Erreur lors de la suppression des tickets');
                      }
                      
                      toast.success('Tous les tickets ont été supprimés avec succès');
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    } catch (error) {
                      toast.error('Erreur lors de la suppression des tickets');
                      console.error(error);
                    }
                  }
                }}
                className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                <span className="hidden md:inline">Tout supprimer</span>
              </Button>
              <Button 
                onClick={() => router.push('/client/tickets/new')}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Nouveau ticket</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="hidden md:table-row">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Titre</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Statut</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priorité</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4 align-middle">
                          <Skeleton className="h-4 w-[40px]" />
                        </td>
                        <td className="p-4 align-middle">
                          <Skeleton className="h-4 w-[200px]" />
                        </td>
                        <td className="p-4 align-middle">
                          <Skeleton className="h-4 w-[80px]" />
                        </td>
                        <td className="p-4 align-middle">
                          <Skeleton className="h-4 w-[80px]" />
                        </td>
                        <td className="p-4 align-middle">
                          <Skeleton className="h-4 w-[120px]" />
                        </td>
                        <td className="p-4 align-middle">
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-sm text-muted-foreground">
                        Une erreur est survenue lors du chargement des tickets
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-sm text-muted-foreground">
                        Aucun ticket trouvé. Créez votre premier ticket en cliquant sur "Nouveau ticket".
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket: Ticket) => (
                      <tr 
                        key={ticket.id} 
                        className="border-t hover:bg-muted/50 md:table-row flex flex-col p-4 md:p-0"
                      >
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">ID:</span>
                          <span>#{ticket.id.substring(0, 8)}</span>
                        </td>
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">Titre:</span>
                          <Link 
                            href={`/client/tickets/${ticket.id}`}
                            className="font-medium hover:underline"
                          >
                            {ticket.title}
                          </Link>
                        </td>
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">Statut:</span>
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">Priorité:</span>
                          <Badge 
                            variant="outline"
                            className={cn(
                              ticket.priority === 'high' ? 'border-red-500 text-red-500' :
                              ticket.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                              'border-green-500 text-green-500'
                            )}
                          >
                            {ticket.priority === 'high' ? 'Haute' : 
                             ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                        </td>
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">Date:</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(ticket.createdAt)}
                          </span>
                        </td>
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">Actions:</span>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Modal de création de ticket */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau ticket</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input 
                id="title" 
                placeholder="Décrivez brièvement votre problème" 
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Décrivez en détail votre problème" 
                rows={5}
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select 
                value={newTicket.priority} 
                onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleCreateTicket} disabled={!newTicket.title || !newTicket.description}>
              Créer le ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
} 