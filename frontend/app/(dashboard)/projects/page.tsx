"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "@/components/projects/project-card"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { Project, projects as projectsApi, ProjectData } from "@/lib/api"


export default function ProjectsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  useEffect(() => { projectsApi.list().then(setProjects) }, [])

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || p.status.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  // const handleCreateProject = async (data: ProjectData) => {
  //   // TODO: Replace with real API call
  //   // import { projects as projectsApi } from '@/lib/api'
  //   // await projectsApi.create(data)
  //   console.log("Create project:", data)
  // }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage and track your team&apos;s projects</p>
        </div>
        <CreateProjectDialog />
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
