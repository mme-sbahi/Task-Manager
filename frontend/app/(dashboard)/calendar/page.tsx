"use client"

import { CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">View your schedule and deadlines</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Calendar view coming soon</p>
          <p className="text-xs text-muted-foreground/60 mt-1">This page will display a calendar with tasks and deadlines.</p>
        </CardContent>
      </Card>
    </div>
  )
}
