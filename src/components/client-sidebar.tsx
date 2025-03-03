"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { 
  Ticket as TicketIcon, 
  PlusCircleIcon, 
  HomeIcon,
  MessageSquareIcon,
  UserIcon
} from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import { ThemeToggle } from "@/components/theme-toggle"

export function ClientSidebar() {
  const pathname = usePathname()
  const { user } = useUser();
  
  return (
    <Sidebar className="min-h-screen border-r lg:relative absolute z-50 bg-background hidden md:flex data-[state=open]:flex">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/client" className="flex items-center gap-2 font-semibold">
            <TicketIcon className="h-6 w-6 text-primary" />
            <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">Support Client</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          <Link 
            href="/client" 
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
              pathname === "/client" 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <HomeIcon className="h-4 w-4 flex-shrink-0" />
            <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">Tableau de bord</span>
          </Link>
          <Link 
            href="/client/tickets" 
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
              pathname.includes("/client/tickets") 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <TicketIcon className="h-4 w-4 flex-shrink-0" />
            <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">Mes tickets</span>
          </Link>
          <Link 
            href="/client/messages" 
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
              pathname.includes("/client/messages") 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <MessageSquareIcon className="h-4 w-4 flex-shrink-0" />
            <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">Messages</span>
          </Link>
          <Link 
            href="/client/profile" 
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 transition-all",
              pathname === "/client/profile" 
                ? "bg-accent text-accent-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <UserIcon className="h-4 w-4 flex-shrink-0" />
            <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">Mon profil</span>
          </Link>
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <div className="text-sm transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">
                <p className="font-medium">{user?.firstName || 'Client'}</p>
                <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
            <div className="transition-opacity duration-300 group-data-[collapsed=true]:absolute group-data-[collapsed=true]:bottom-4 group-data-[collapsed=true]:left-1/2 group-data-[collapsed=true]:transform group-data-[collapsed=true]:-translate-x-1/2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  )
} 