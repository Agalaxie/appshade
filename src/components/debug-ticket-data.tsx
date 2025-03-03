"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebugTicketDataProps {
  data: any
}

export function DebugTicketData({ data }: DebugTicketDataProps) {
  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle className="text-white">Données brutes du ticket (Debug)</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto max-h-[400px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
} 