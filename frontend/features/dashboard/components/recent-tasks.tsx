"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { tasks, Task } from "@/lib/api"

const priorityVariant: Record<string, string> = {
  HIGH: "warning",
  MEDIUM: "default",
  LOW: "secondary",
}

const statusLabel: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
}

function getDueLabel(dueDate: string): string {
  if (!dueDate) return "No due date"
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"
  if (diffDays > 1) return `In ${diffDays} days`
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`
  return "No due date"
}

function getInitials(user?: { fullName?: string }): string {
  if (!user?.fullName) return "?"
  return user.fullName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function RecentTasks() {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tasks.listMyTasks()
      .then(data => {
        const sorted = data
          .filter(t => t.dueDate)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5)
        setTaskList(sorted)
      })
      .catch(err => console.error("Failed to load tasks:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 animate-pulse">
                <div className="h-7 w-7 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 bg-muted rounded" />
                  <div className="h-2 w-1/2 bg-muted rounded" />
                </div>
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
        <CardTitle className="text-base">Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {taskList.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No tasks found
            </div>
          ) : (
            taskList.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {getDueLabel(task.dueDate)}
                  </p>
                </div>
                <Badge
                  variant={priorityVariant[task.priority] as "warning" | "default" | "secondary" | "destructive"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {statusLabel[task.status] || task.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}