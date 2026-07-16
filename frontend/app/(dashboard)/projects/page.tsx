"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "@/components/projects/project-card"

// TODO: Replace with API data — import { projects as projectsApi } from '@/lib/api'
// const [projects, setProjects] = useState<Project[]>([])
// useEffect(() => { projectsApi.list().then(setProjects) }, [])
const projects = [
  { id: 1, name: "Design System", description: "Component library and design tokens", progress: 80, tasks: 24, members: 4, status: "Active" },
  { id: 2, name: "Mobile App v2", description: "React Native rewrite with new features", progress: 45, tasks: 36, members: 6, status: "In Progress" },
  { id: 3, name: "API Gateway", description: "Unified API layer for microservices", progress: 90, tasks: 18, members: 3, status: "Active" },
  { id: 4, name: "User Dashboard", description: "Customer-facing analytics dashboard", progress: 30, tasks: 42, members: 5, status: "Planning" },
  { id: 5, name: "Auth Service", description: "OAuth 2.0 and SSO integration", progress: 60, tasks: 15, members: 2, status: "Active" },
  { id: 6, name: "Notification System", description: "Email, push and in-app notifications", progress: 15, tasks: 28, members: 4, status: "Planning" },
]

export default function ProjectsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || p.status.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const handleCreateProject = () => {
    // TODO: Implement create project flow
    // import { projects as projectsApi } from '@/lib/api'
    // const newProject = await projectsApi.create({ name, description, status: 'Planning' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and track your team&apos;s projects</p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-1" />New Project
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => <ProjectCard key={project.id} {...project} />)}
      </div>
    </div>
  )
}
