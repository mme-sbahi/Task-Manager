"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Task } from "@/lib/api"


const priorityConfig = {
  HIGH: { label: "High", variant: "warning" as const },
  MEDIUM: { label: "Medium", variant: "default" as const },
  LOW: { label: "Low", variant: "secondary" as const },
};

export function TaskCard({ task, onEdit, onDelete }: { task: Task; onEdit: () => void; onDelete: () => void }) {
  const config = priorityConfig[task.priority]

  return (
    <Card className="group">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                    <DialogDescription>Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be undone.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogTrigger asChild><Button variant="outline">Cancel</Button></DialogTrigger>
                    <Button variant="destructive" onClick={onDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
          <div className="flex items-center justify-between gap-2">
            <Badge variant={config.variant} className="text-[10px] px-1.5 py-0">{config.label}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
              {/* <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px]">{task.assignee}</AvatarFallback></Avatar> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
