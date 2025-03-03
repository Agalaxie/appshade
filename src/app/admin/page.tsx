"use client"

import React from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketIcon, UsersIcon, ClockIcon, AlertCircleIcon, CheckCircleIcon, BarChart3Icon } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Tableau de bord Admin</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <TicketIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">
                  +15 depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets en attente</CardTitle>
                <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  +3 depuis hier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets résolus</CardTitle>
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85</div>
                <p className="text-xs text-muted-foreground">
                  +12 depuis la semaine dernière
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +8 depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Tickets récents</CardTitle>
                <CardDescription>
                  Les tickets les plus récents nécessitant une attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: 'TK-1234', client: 'Jean Dupont', title: 'Problème de connexion', status: 'Urgent', date: '2023-02-25' },
                    { id: 'TK-1233', client: 'Marie Martin', title: 'Erreur lors du paiement', status: 'En attente', date: '2023-02-24' },
                    { id: 'TK-1232', client: 'Pierre Durand', title: 'Demande de fonctionnalité', status: 'Normal', date: '2023-02-20' },
                    { id: 'TK-1231', client: 'Sophie Petit', title: 'Bug dans l\'interface', status: 'Urgent', date: '2023-02-19' },
                    { id: 'TK-1230', client: 'Lucas Bernard', title: 'Question sur la facturation', status: 'Normal', date: '2023-02-18' },
                  ].map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {ticket.id} • Client: {ticket.client} • {ticket.date}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          ticket.status === 'Urgent' 
                            ? 'bg-red-50 text-red-700' 
                            : ticket.status === 'En attente'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>
                  Aperçu des performances du support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Temps de réponse moyen</span>
                      </div>
                      <span className="font-medium">1h 45m</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[70%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Taux de résolution</span>
                      </div>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                        <span>Satisfaction client</span>
                      </div>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[92%] rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 