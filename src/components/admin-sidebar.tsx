"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/ui/sidebar'
import { 
  TicketIcon, 
  UsersIcon, 
  HomeIcon,
  MessageSquareIcon,
  SettingsIcon,
  BarChart3Icon
} from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { useRoles } from "@/hooks/use-roles";

interface NavItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isActive?: boolean
}

function NavItem({ href, icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">{title}</span>
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useUser();
  const { isAdmin, loading } = useRoles();
  
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  if (!isAdmin) {
    return <div>Accès non autorisé</div>;
  }
  
  return (
    <Sidebar className="min-h-screen border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <TicketIcon className="h-6 w-6 text-primary" />
            <span className="transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          <NavItem 
            href="/admin" 
            icon={<HomeIcon className="h-4 w-4" />} 
            title="Dashboard" 
            isActive={pathname === "/admin"} 
          />
          <NavItem 
            href="/admin/tickets" 
            icon={<TicketIcon className="h-4 w-4" />} 
            title="Tickets" 
            isActive={pathname.includes("/admin/tickets")} 
          />
          <NavItem 
            href="/admin/users" 
            icon={<UsersIcon className="h-4 w-4" />} 
            title="Utilisateurs" 
            isActive={pathname.includes("/admin/users")} 
          />
          <NavItem 
            href="/admin/messages" 
            icon={<MessageSquareIcon className="h-4 w-4" />} 
            title="Messages" 
            isActive={pathname.includes("/admin/messages")} 
          />
          <NavItem 
            href="/admin/analytics" 
            icon={<BarChart3Icon className="h-4 w-4" />} 
            title="Analytiques" 
            isActive={pathname.includes("/admin/analytics")} 
          />
          <NavItem 
            href="/admin/settings" 
            icon={<SettingsIcon className="h-4 w-4" />} 
            title="Paramètres" 
            isActive={pathname.includes("/admin/settings")} 
          />
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <div className="text-sm transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 overflow-hidden">
                <p className="font-medium">{user?.firstName || 'Admin'}</p>
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