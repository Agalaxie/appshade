"use client"

import React from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { MessageCard } from '@/components/message-card'
import { Loading } from '@/components/ui/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Message } from '@/types'

export default function AdminMessagesPage() {
  // Dans un environnement réel, ces données seraient récupérées depuis une API
  const messages: Message[] = [
    {
      id: 'msg-1',
      content: 'Votre ticket a été mis à jour',
      ticketId: 'TK-1234',
      senderId: 'admin-1',
      senderType: 'admin',
      createdAt: '2023-02-25T14:20:00Z',
      updatedAt: '2023-02-25T14:20:00Z',
      read: false
    },
    {
      id: 'msg-2',
      content: 'Nous avons besoin d\'informations supplémentaires',
      ticketId: 'TK-1233',
      senderId: 'admin-2',
      senderType: 'admin',
      createdAt: '2023-02-24T10:30:00Z',
      updatedAt: '2023-02-24T10:30:00Z',
      read: false
    },
    {
      id: 'msg-3',
      content: 'Ticket #TK-1234 créé avec succès',
      ticketId: 'TK-1234',
      senderId: 'system',
      senderType: 'system',
      createdAt: '2023-02-25T10:30:00Z',
      updatedAt: '2023-02-25T10:30:00Z',
      read: true
    },
    {
      id: 'msg-4',
      content: 'J\'ai le message "Identifiants incorrects" mais je suis sûr que mon mot de passe est correct.',
      ticketId: 'TK-1234',
      senderId: 'client-1',
      senderType: 'client',
      createdAt: '2023-02-25T11:30:00Z',
      updatedAt: '2023-02-25T11:30:00Z',
      read: true
    },
    {
      id: 'msg-5',
      content: 'Merci pour votre aide, mon problème est résolu.',
      ticketId: 'TK-1232',
      senderId: 'client-3',
      senderType: 'client',
      createdAt: '2023-02-22T11:00:00Z',
      updatedAt: '2023-02-22T11:00:00Z',
      read: false
    }
  ];
  
  const loading = false;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Tous les messages</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loading />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">Aucun message trouvé</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div key={message.id} className="flex flex-col space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Ticket: #{message.ticketId}
                      </div>
                      <MessageCard message={message} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 