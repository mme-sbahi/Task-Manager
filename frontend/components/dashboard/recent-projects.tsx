import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, Users } from "lucide-react"

const projects = [
  { id: 1, name: "Design System", progress: 80, tasks: 24, members: 4 },
  { id: 2, name: "Mobile App v2", progress: 45, tasks: 36, members: 6 },
  { id: 3, name: "API Gateway", progress: 90, tasks: 18, members: 3 },
  { id: 4, name: "User Dashboard", progress: 30, tasks: 42, members: 5 },
]

export function RecentProjects() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {projects.map((project) => (
            <div key={project.id} className="px-5 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{project.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" />{project.tasks}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.members}</span>
                </div>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
