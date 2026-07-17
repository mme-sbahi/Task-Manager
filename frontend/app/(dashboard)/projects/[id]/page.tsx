"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Mail, UserMinus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KanbanBoard } from "@/components/projects/kanban-board"
import type { ProjectData, ProjectMember } from "@/lib/api"

// TODO: Replace with API data — import { projects } from '@/lib/api'
const mockProject: Record<number, { name: string; description: string }> = {
  1: { name: "Design System", description: "Component library and design tokens" },
  2: { name: "Mobile App v2", description: "React Native rewrite with new features" },
  3: { name: "API Gateway", description: "Unified API layer for microservices" },
}

const mockMembers: ProjectMember[] = [
  { id: "1", email: "sahil@company.com", fullName: "Sahil A.", role: "Owner", joinedAt: "2026-01-15" },
  { id: "2", email: "alice@company.com", fullName: "Alice Chen", role: "Admin", joinedAt: "2026-02-10" },
  { id: "3", email: "bob@company.com", fullName: "Bob Martinez", role: "Member", joinedAt: "2026-03-05" },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const project = mockProject[Number(params.id)] ?? { name: "Project", description: "" }

  const [members, setMembers] = useState<ProjectMember[]>(mockMembers)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const [editName, setEditName] = useState(project.name)
  const [editDescription, setEditDescription] = useState(project.description)
  const [inviteEmail, setInviteEmail] = useState("")

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [inviting, setInviting] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return
    setSaving(true)
    try {
      // TODO: Replace with real API call
      // import { projects } from '@/lib/api'
      // await projects.update(Number(params.id), { name: editName.trim(), description: editDescription.trim() })
      toast.success("Project updated")
      setEditOpen(false)
    } catch {
      toast.error("Failed to update project")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      // TODO: Replace with real API call
      // await projects.delete(Number(params.id))
      toast.success("Project deleted")
      router.push("/projects")
    } catch {
      toast.error("Failed to delete project")
      setDeleting(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      // TODO: Replace with real API call
      // import { projects } from '@/lib/api'
      // await projects.inviteMember(Number(params.id), inviteEmail.trim())
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail("")
      setInviteOpen(false)
    } catch {
      toast.error("Failed to send invitation")
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string, fullName: string) => {
    // TODO: Replace with real API call
    // await projects.removeMember(Number(params.id), memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    toast.success(`${fullName} removed from project`)
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/projects"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-1" />Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleUpdate}>
                <DialogHeader>
                  <DialogTitle>Update Project</DialogTitle>
                  <DialogDescription>Edit the project name and description.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-desc">Description</Label>
                    <Textarea id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving || !editName.trim()}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Deleting...</> : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />

      {/* Members Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>People with access to this project.</CardDescription>
          </div>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Mail className="h-4 w-4 mr-1" />Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleInvite}>
                <DialogHeader>
                  <DialogTitle>Invite Member</DialogTitle>
                  <DialogDescription>Send an invitation by email.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="invite-email">Email address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
                    {inviting ? "Sending..." : "Send Invite"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {member.fullName.split(" ").map((s) => s[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.fullName}</p>
                    <p className="text-xs text-muted-foreground">{member.email} &middot; {member.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveMember(member.id, member.fullName)}
                >
                  <UserMinus className="h-4 w-4 mr-1" />Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
