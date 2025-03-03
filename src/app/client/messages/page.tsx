"use client"

import React from 'react'
import { ClientSidebar } from '@/components/client-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { MessageCard } from '@/components/message-card'
import { Loading } from '@/components/ui/loading'
import { Message } from '@/types'

export default function ClientMessagesPage() {
  // Dans un environnement réel, ce hook serait utilisé pour récupérer les données
  // Pour l'instant, nous utilisons des données statiques
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
    }
  ];
  
  const loading = false;

  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loading />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">Vous n'avez pas de messages</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 