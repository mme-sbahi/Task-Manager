"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/projects/task-card"
import { TaskModal } from "@/components/tasks/task-modal"

interface Task {
  id: number
  title: string
  description: string
  priority: "urgent" | "high" | "medium" | "low"
  dueDate: string
  assignee: string
  status: string
}

const columns = [
  { id: "todo", title: "Todo", color: "bg-muted-foreground" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-500" },
  { id: "review", title: "Review", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
]

// TODO: Replace with API data — import { tasks as tasksApi } from '@/lib/api'
// const [tasks, setTasks] = useState<Task[]>([])
// useEffect(() => { tasksApi.list().then(setTasks) }, [])
const initialTasks: Task[] = [
  { id: 1, title: "Design system color tokens", description: "Update color palette in design tokens", priority: "high", dueDate: "2026-07-20", assignee: "SA", status: "todo" },
  { id: 2, title: "API rate limiting", description: "Implement rate limiting middleware", priority: "urgent", dueDate: "2026-07-18", assignee: "MK", status: "todo" },
  { id: 3, title: "User onboarding flow", description: "Redesign the onboarding experience", priority: "medium", dueDate: "2026-07-22", assignee: "AL", status: "in-progress" },
  { id: 4, title: "Database migration script", description: "Write migration for v2 schema", priority: "high", dueDate: "2026-07-17", assignee: "JD", status: "review" },
  { id: 5, title: "Mobile responsive nav", description: "Make navigation responsive on mobile", priority: "low", dueDate: "2026-07-25", assignee: "SA", status: "done" },
  { id: 6, title: "Dark mode support", description: "Add dark mode theme support", priority: "medium", dueDate: "2026-07-19", assignee: "MK", status: "in-progress" },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreate = () => { setEditingTask(null); setModalOpen(true) }
  const handleEdit = (task: Task) => { setEditingTask(task); setModalOpen(true) }
  const handleSave = (data: Partial<Task>) => {
    // TODO: Implement save via backend API
    // import { tasks as tasksApi } from '@/lib/api'
    // if (editingTask) { await tasksApi.update(editingTask.id, data) }
    // else { await tasksApi.create(data) }
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...data } as Task : t)))
    } else {
      setTasks([...tasks, { ...data, id: Date.now() } as Task])
    }
    setModalOpen(false)
    setEditingTask(null)
  }
  const handleDelete = (taskId: number) => {
    // TODO: Implement delete via backend API
    // import { tasks as tasksApi } from '@/lib/api'
    // await tasksApi.delete(taskId)
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Kanban Board</h2>
        <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" />Add Task</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id)
          return (
            <div key={col.id} className="rounded-lg border bg-card">
              <div className="flex items-center gap-2 border-b px-3 py-2.5">
                <div className={`h-2 w-2 rounded-full ${col.color}`} />
                <span className="text-sm font-medium">{col.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{colTasks.length}</span>
              </div>
              <div className="space-y-2 p-2">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={() => handleEdit(task)} onDelete={() => handleDelete(task.id)} />
                ))}
                {colTasks.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No tasks</p>}
              </div>
            </div>
          )
        })}
      </div>
      <TaskModal open={modalOpen} onOpenChange={setModalOpen} task={editingTask} onSave={handleSave} />
    </div>
  )
}
