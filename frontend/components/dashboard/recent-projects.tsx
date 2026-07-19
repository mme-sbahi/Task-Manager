"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, Users } from "lucide-react"
import { projects as projectsApi, Project } from "@/lib/api"

// Helper to calculate progress from tasks (if your API doesn't provide it)
// For now, we'll use a placeholder since the Project type doesn't have task/member counts
// You can replace this with real logic once your backend provides these fields

export function RecentProjects() {
  const [projectList, setProjectList] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsApi.list()
      .then(data => {
        const recent = data
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
        setProjectList(recent)
      })
      .catch(err => console.error("Failed to load projects:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Projects</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-3 space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-muted rounded" />
                  <div className="flex gap-3">
                    <div className="h-3 w-8 bg-muted rounded" />
                    <div className="h-3 w-8 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {projectList.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No projects found
            </div>
          ) : (
            projectList.map((project) => (
              <div key={project.id} className="px-5 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FolderKanban className="h-3 w-3" />
                      {project.taskCount ?? '--'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.memberCount ?? '--'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}