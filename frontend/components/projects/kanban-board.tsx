"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/projects/task-card"
import { TaskModal } from "@/components/tasks/task-modal"
import { tasks as tasksApi, Task } from '@/lib/api'
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errors"



const columns = [
  { id: "todo", title: "Todo", color: "bg-muted-foreground" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-500" },
  { id: "review", title: "Review", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
]



export function KanbanBoard(projectId: any) {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => { tasksApi.list(projectId.projectId).then(setTasks) }, [])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreate = () => { setEditingTask(null); setModalOpen(true) }
  const handleEdit = (task: Task) => { setEditingTask(task); setModalOpen(true) }
  const handleSave = async (data: Partial<Task>) => {
    try {
      if (editingTask) { await tasksApi.update(projectId.projectId, editingTask.id, data) }
      else { await tasksApi.create(projectId.projectId, data) }
      setModalOpen(false)
      setEditingTask(null)

    } catch (err){
      toast.error(getErrorMessage(err))
    }
  }
  const handleDelete = async (taskId: number) => {
    await tasksApi.delete(projectId.projectId, taskId)
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
      <TaskModal projectId={projectId.projectId as string} open={modalOpen} onOpenChange={setModalOpen} task={editingTask} onSave={handleSave} />
    </div>
  )
}
