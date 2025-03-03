"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Définir le type ThemeProviderProps localement
type ThemeProviderProps = {
  children: React.ReactNode;
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 

