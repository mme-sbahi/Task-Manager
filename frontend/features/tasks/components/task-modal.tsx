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
import { tasks as tasksApi, Task, projects, ProjectMember } from '@/lib/api'


export function TaskModal({ projectId, open, onOpenChange, task, onSave }: {projectId:string; 
  open: boolean; onOpenChange: (v: boolean) => void; task: Task | null; onSave: (data: Partial<Task>) => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [dueDate, setDueDate] = useState("")
  const [assigneeId, setAssigneeId] = useState("");

  const [members, setMembers] = useState<ProjectMember[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await projects.listMembers(projectId);
      console.log("API returned:", data);
      setMembers(data);
    };
  
    fetchMembers();
  }, [projectId]);
  
  useEffect(() => {
    console.log("members state:", members);
  }, [members]);

  useEffect(() => {
    if (task) {
      setTitle(task.title); setDescription(task.description); setStatus(task.status.toLowerCase())
      setPriority(task.priority.toLowerCase() as "high" | "medium" | "low"); setDueDate(task.dueDate ? task.dueDate.split('T')[0] : ''); setAssigneeId(task.assigneeId ?? "")
    } else {
      setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium"); setDueDate(""); setAssigneeId("")
    }
  }, [task, open])

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  onSave({
    title,
    description,
    status: status.toUpperCase() as Task["status"],
    priority: priority.toUpperCase() as Task["priority"],
    // Send YYYY-MM-DD, or today's date in LOCAL timezone (not UTC)
    dueDate: dueDate || new Date().toLocaleDateString('en-CA'),  // "2026-07-19" in local time
    assigneeId: assigneeId || undefined,
  });
};

const formatDisplayDate = (isoDate: string) => {
  if (!isoDate) return 'No due date';
  const [y, m, d] = isoDate.split('T')[0].split('-').map(Number);
  return `${m}/${d}/${y}`;  // 2/7/2026
};
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
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as "high" | "medium" | "low")}>
                  <SelectTrigger id="task-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
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
                <Select
    value={assigneeId}
    onValueChange={setAssigneeId}
>
    <SelectTrigger>
        <SelectValue placeholder="Assign to" />
    </SelectTrigger>

    <SelectContent>
        {members.map(member => (
            <SelectItem
                key={member.id}
                value={member.userId} 
            >
                {member.user.fullName}
            </SelectItem>
        ))}
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
