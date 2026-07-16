"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanBoard } from "@/components/projects/kanban-board"

// TODO: Replace with API data — import { projects } from '@/lib/api'
// const [project, setProject] = useState<Project | null>(null)
// useEffect(() => { projects.get(Number(params.id)).then(setProject) }, [params.id])
const mockProject: Record<number, { name: string; description: string }> = {
  1: { name: "Design System", description: "Component library and design tokens" },
  2: { name: "Mobile App v2", description: "React Native rewrite with new features" },
  3: { name: "API Gateway", description: "Unified API layer for microservices" },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const project = mockProject[Number(params.id)] ?? { name: "Project", description: "" }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
      </div>
      <KanbanBoard />
    </div>
  )
}
