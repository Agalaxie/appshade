"use client"

import React from 'react'
import Link from 'next/link'
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { SearchIcon, FilterIcon, UserPlusIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Client } from '@/types'

export default function AdminClientsPage() {
  // Dans un environnement réel, ces données seraient récupérées depuis une API
  const clients: Client[] = [
    {
      id: 'client-1',
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      company: 'Entreprise ABC',
      createdAt: '2022-01-15T10:00:00Z'
    },
    {
      id: 'client-2',
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      company: 'Société XYZ',
      createdAt: '2022-03-22T14:30:00Z'
    },
    {
      id: 'client-3',
      name: 'Pierre Durand',
      email: 'pierre.durand@example.com',
      createdAt: '2022-05-10T09:15:00Z'
    },
    {
      id: 'client-4',
      name: 'Sophie Petit',
      email: 'sophie.petit@example.com',
      company: 'Groupe 123',
      createdAt: '2022-07-05T16:45:00Z'
    },
    {
      id: 'client-5',
      name: 'Lucas Bernard',
      email: 'lucas.bernard@example.com',
      createdAt: '2022-09-18T11:20:00Z'
    }
  ];
  
  const loading = false;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Clients</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="h-9 w-[200px] rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
            <Button size="sm">
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Liste des clients</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loading />
                </div>
              ) : clients.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">Aucun client trouvé</p>
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nom</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Entreprise</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date d'inscription</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {clients.map((client) => (
                        <tr key={client.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{client.name}</td>
                          <td className="p-4 align-middle">{client.email}</td>
                          <td className="p-4 align-middle">{client.company || '-'}</td>
                          <td className="p-4 align-middle">{formatDate(client.createdAt)}</td>
                          <td className="p-4 align-middle">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/clients/${client.id}`}>
                                Voir
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 