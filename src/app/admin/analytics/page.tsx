"use client"

import React from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// Données de démonstration
const ticketsByDay = [
  { name: 'Lun', tickets: 12 },
  { name: 'Mar', tickets: 19 },
  { name: 'Mer', tickets: 15 },
  { name: 'Jeu', tickets: 22 },
  { name: 'Ven', tickets: 18 },
  { name: 'Sam', tickets: 8 },
  { name: 'Dim', tickets: 5 },
]

const responseTime = [
  { name: '9h', time: 45 },
  { name: '10h', time: 30 },
  { name: '11h', time: 25 },
  { name: '12h', time: 40 },
  { name: '13h', time: 35 },
  { name: '14h', time: 20 },
  { name: '15h', time: 15 },
  { name: '16h', time: 25 },
]

const ticketCategories = [
  { name: 'Technique', value: 45 },
  { name: 'Facturation', value: 25 },
  { name: 'Compte', value: 15 },
  { name: 'Feature', value: 10 },
  { name: 'Autre', value: 5 },
]

const COLORS = ['hsl(47.9, 95.8%, 53.1%)', 'hsl(160, 60%, 45%)', 'hsl(30, 80%, 55%)', 'hsl(280, 65%, 60%)', 'hsl(340, 75%, 55%)']

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Analytiques</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Tickets par jour</CardTitle>
                <CardDescription>Nombre de tickets créés par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketsByDay}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tickets" fill="hsl(47.9, 95.8%, 53.1%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temps de réponse</CardTitle>
                <CardDescription>Temps de réponse moyen par heure (minutes)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTime}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        stroke="hsl(47.9, 95.8%, 53.1%)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des tickets</CardTitle>
                <CardDescription>Distribution par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent: number }) => 
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ticketCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble des performances</CardTitle>
              <CardDescription>Statistiques clés du support client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction client</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Taux de résolution</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Temps moyen de résolution</p>
                  <p className="text-2xl font-bold">2h 15m</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Tickets résolus aujourd'hui</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 