"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  collapsible: "icon" | "expanded" | "none"
}>({
  collapsed: false,
  setCollapsed: () => {},
  collapsible: "none",
})

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  collapsible?: "icon" | "expanded" | "none"
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsible = "expanded",
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, collapsible }}>
      <div
        className="group/sidebar-wrapper flex h-full"
        data-collapsible={collapsible}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  const { collapsed, collapsible } = useSidebar()

  return (
    <div
      data-collapsed={collapsed}
      data-state={collapsed ? "closed" : "open"}
      className={cn(
        "group flex h-full flex-col overflow-hidden border-r bg-background transition-[width] duration-300 ease-in-out",
        collapsed && collapsible === "expanded"
          ? "w-16"
          : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SidebarInset({ children, className, ...props }: SidebarInsetProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col overflow-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { collapsed, setCollapsed, collapsible } = useSidebar()

  if (collapsible === "none") {
    return null
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
} 