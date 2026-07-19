"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { tasks, Task } from "@/lib/api"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const priorityDot: Record<string, string> = {
  HIGH: "bg-amber-500",
  MEDIUM: "bg-blue-500",
  LOW: "bg-muted-foreground",
}

export default function CalendarPage() {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    tasks.listMyTasks()
      .then(data => {
        setTaskList(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  // FIX: Normalize task due dates to YYYY-MM-DD (strip time/timezone)
  const tasksByDate: Record<string, Task[]> = {}
  taskList.forEach((task) => {
    // Handle both "2026-02-07" and "2026-02-07T00:00:00.000Z"
    const key = task.dueDate ? task.dueDate.split('T')[0] : ''
    if (!key) return
    if (!tasksByDate[key]) tasksByDate[key] = []
    tasksByDate[key].push(task)
  })

  // FIX: Build calendar weeks
  const weeks: (number | null)[][] = []
  let days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
    if (days.length === 7) {
      weeks.push(days)
      days = []
    }
  }
  if (days.length > 0) {
    while (days.length < 7) days.push(null)
    weeks.push(days)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const monthLabel = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // FIX: Generate YYYY-MM-DD without timezone issues
  const formatDateKey = (day: number) => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`  // e.g., "2026-02-07"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">View your schedule and deadlines</p>
      </div>


      <div className="border rounded-lg bg-background">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-sm font-semibold">{monthLabel}</h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 border-b">
          {daysOfWeek.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground border-r last:border-r-0">
              {d}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square border-r border-b last:border-r-0 animate-pulse bg-muted/20" />
            ))}
          </div>
        ) : (
          weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                if (day === null) {
                  return <div key={`empty-${di}`} className="aspect-square border-r border-b last:border-r-0 bg-muted/10" />
                }

                const dateKey = formatDateKey(day)
                const dayTasks = tasksByDate[dateKey] ?? []
                const isToday = isCurrentMonth && day === today.getDate()

                return (
                  <div
                    key={day}
                    className={`aspect-square border-r border-b last:border-r-0 p-1 overflow-hidden ${
                      isToday ? "bg-accent/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <span
                        className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-1 rounded px-1 py-0.5 bg-secondary/50">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot[task.priority] ?? "bg-muted-foreground"}`} />
                          <span className="text-[10px] truncate leading-none">{task.title}</span>
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <p className="text-[10px] text-muted-foreground text-center">+{dayTasks.length - 3} more</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground" /> Low</span>
      </div>
    </div>
  )
}