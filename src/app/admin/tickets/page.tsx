"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from "@/components/ui/status-badge"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FilterIcon, 
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  RefreshCw,
  SearchIcon
} from "lucide-react"
import { Ticket } from '@/types'
import { useApi } from '@/hooks/use-api'
import { logger } from '@/lib/logger'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatDate } from '@/lib/utils'

export default function AdminTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refreshCounter, setRefreshCounter] = useState(0)
  
  const {
    data: tickets,
    error,
    loading,
    refetch
  } = useApi<Ticket[]>('/api/tickets', {
    refreshInterval: null, // Désactiver le rafraîchissement automatique
  })

  // Rafraîchir manuellement
  const handleRefresh = () => {
    logger.debug('Rafraîchissement manuel des tickets admin')
    setRefreshCounter(prev => prev + 1)
    refetch()
  }

  // Filtrer les tickets en fonction des critères
  const filteredTickets = tickets ? tickets.filter((ticket: Ticket) => {
    // Filtre par recherche
    const matchesSearch = ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          false

    // Filtre par statut
    const matchesStatus = statusFilter === 'all' ? true : ticket.status === statusFilter
    
    return matchesSearch && matchesStatus;
  }) : []

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Tous les tickets</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {filteredTickets.length} tickets
            </Badge>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un ticket..." 
                  className="w-full md:w-auto pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                onClick={handleRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden md:inline">Actualiser</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <FilterIcon className="h-4 w-4" />
                <span className="hidden md:inline">Filtres avancés</span>
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
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
                          <Skeleton className="h-4 w-[120px]" />
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
                      <td colSpan={7} className="p-4 text-center text-sm text-muted-foreground">
                        Une erreur est survenue lors du chargement des tickets
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-sm text-muted-foreground">
                        Aucun ticket trouvé
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
                            href={`/admin/tickets/${ticket.id}`}
                            className="font-medium hover:underline"
                          >
                            {ticket.title}
                          </Link>
                        </td>
                        <td className="md:p-4 md:align-middle md:table-cell flex justify-between items-center">
                          <span className="font-medium md:font-normal md:hidden">Client:</span>
                          <span>{ticket.clientName || ticket.user?.firstName || 'Client'}</span>
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
    </SidebarProvider>
  )
} 