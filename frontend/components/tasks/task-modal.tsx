"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

interface Task {
  id: number; title: string; description: string; priority: "urgent" | "high" | "medium" | "low"; dueDate: string; assignee: string; status: string
}

export function TaskModal({ open, onOpenChange, task, onSave }: {
  open: boolean; onOpenChange: (v: boolean) => void; task: Task | null; onSave: (data: Partial<Task>) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low">("medium")
  const [dueDate, setDueDate] = useState("")
  const [assignee, setAssignee] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title); setDescription(task.description); setStatus(task.status)
      setPriority(task.priority); setDueDate(task.dueDate); setAssignee(task.assignee)
    } else {
      setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium"); setDueDate(""); setAssignee("")
    }
  }, [task, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement save via backend API
    // import { tasks as tasksApi } from '@/lib/api'
    // if (task) { await tasksApi.update(task.id, { title, description, status, priority, dueDate, assignee }) }
    // else { await tasksApi.create({ title, description, status, priority, dueDate, assignee }) }
    onSave({ title, description, status, priority, dueDate, assignee })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-desc">Description</Label>
              <Textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="task-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as "urgent" | "high" | "medium" | "low")}>
                  <SelectTrigger id="task-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-due">Due Date</Label>
                <Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger id="task-assignee"><SelectValue placeholder="Assign to" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SA">Sahil A.</SelectItem>
                    <SelectItem value="MK">Maya K.</SelectItem>
                    <SelectItem value="AL">Alex L.</SelectItem>
                    <SelectItem value="JD">Jordan D.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
