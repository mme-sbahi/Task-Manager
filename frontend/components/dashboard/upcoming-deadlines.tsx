"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, AlertCircle } from "lucide-react"
import { tasks, Task } from "@/lib/api"

const statusLabel: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
}

function getDueLabel(dueDate: string): string {
  if (!dueDate) return ""
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === 2) return "In 2 days"
  if (diffDays === 3) return "In 3 days"
  if (diffDays === 4) return "In 4 days"
  if (diffDays === 5) return "In 5 days"
  return ""
}

function isUrgent(task: Task): boolean {
  if (!task.dueDate) return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(task.dueDate)
  due.setHours(0, 0, 0, 0)
  
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  // Urgent if due today or overdue, or high priority with tight deadline
  return diffDays <= 0 || (task.priority === "HIGH" && diffDays <= 1)
}

export function UpcomingDeadlines() {
  const [deadlineList, setDeadlineList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tasks.listMyTasks()
      .then(data => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // Filter tasks due in next 5 days (including today), exclude done tasks
        const upcoming = data
          .filter(task => {
            if (!task.dueDate) return false
            if (task.status === "DONE") return false
            
            const due = new Date(task.dueDate)
            due.setHours(0, 0, 0, 0)
            
            const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            return diffDays >= 0 && diffDays <= 5
          })
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        
        setDeadlineList(upcoming)
      })
      .catch(err => console.error("Failed to load deadlines:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                <div className="h-4 w-4 rounded-full bg-muted" />
                <div className="flex-1 h-3 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {deadlineList.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No upcoming deadlines
            </div>
          ) : (
            deadlineList.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                {isUrgent(task) ? (
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                ) : (
                  <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                </div>
                <Badge 
                  variant={isUrgent(task) ? "destructive" : "secondary"} 
                  className="text-[10px] px-1.5 py-0"
                >
                  {getDueLabel(task.dueDate)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}