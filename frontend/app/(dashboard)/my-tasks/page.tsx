"use client"

import { ListChecks } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
        <p className="text-sm text-muted-foreground">Tasks assigned to you</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ListChecks className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Task list view coming soon</p>
          <p className="text-xs text-muted-foreground/60 mt-1">This page will display all tasks assigned to you in a filterable list.</p>
        </CardContent>
      </Card>
    </div>
  )
}
