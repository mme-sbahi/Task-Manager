"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { tasks, type Task } from "@/lib/api"

const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 3 }

const statusConfig: Record<string, { label: string; color: "warning" | "default" | "secondary" | "success" }> = {
  TODO: { label: "To Do", color: "warning" },
  IN_PROGRESS: { label: "In Progress", color: "default" },
  REVIEW: { label: "Review", color: "secondary" },
  DONE: { label: "Done", color: "success" },
}

const priorityConfig: Record<string, { label: string; color: "destructive" | "warning" | "secondary" | "outline" }> = {
  HIGH: { label: "High", color: "warning" },
  MEDIUM: { label: "Medium", color: "secondary" },
  LOW: { label: "Low", color: "outline" },
}

export default function MyTasksPage() {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate")

  useEffect(() => {
    tasks.listMyTasks().then(setTaskList).finally(() => setLoading(false))

  }, [])

  const filtered = [...taskList]
    .filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || t.status === statusFilter
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      if (sortBy === "priority") return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
        <p className="text-sm text-muted-foreground">Tasks assigned to you</p>
      </div>

<div className="flex flex-wrap items-center gap-3">
  <div className="relative flex-[2] min-w-[200px]">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-8 w-full"
    />
  </div>
  <div className="flex items-center gap-3 flex-1 justify-end">
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-[130px]">
        <Filter className="h-3.5 w-3.5 mr-1.5" />
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="TODO">To Do</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
        <SelectItem value="REVIEW">Review</SelectItem>
        <SelectItem value="DONE">Done</SelectItem>
      </SelectContent>
    </Select>
    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
      <SelectTrigger className="w-[130px]">
        <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Priority</SelectItem>
        <SelectItem value="HIGH">High</SelectItem>
        <SelectItem value="MEDIUM">Medium</SelectItem>
        <SelectItem value="LOW">Low</SelectItem>
      </SelectContent>
    </Select>
    <Select value={sortBy} onValueChange={(v) => setSortBy(v as "dueDate" | "priority")}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dueDate">Sort by Date</SelectItem>
        <SelectItem value="priority">Sort by Priority</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="h-16 animate-pulse bg-muted/30 rounded-lg" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => {
            const statusCfg = statusConfig[task.status] ?? { label: task.status, color: "default" as const }
            const priorityCfg = priorityConfig[task.priority] ?? { label: task.priority, color: "outline" as const }
            const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "DONE"

            return (
              <Card key={task.id} className="hover:border-muted-foreground/20 transition-colors">
                <CardContent className="flex items-center gap-4 py-3.5 px-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={priorityCfg.color}>{priorityCfg.label}</Badge>
                    <Badge variant={statusCfg.color}>{statusCfg.label}</Badge>
                    <span className={`text-xs whitespace-nowrap ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                      {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
