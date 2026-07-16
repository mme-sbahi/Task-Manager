import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FolderKanban, Users } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  id: number
  name: string
  description: string
  progress: number
  tasks: number
  members: number
  status: string
}

export function ProjectCard({ id, name, description, progress, tasks, members, status }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderKanban className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px]">{status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress value={progress} className="h-1.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" />{tasks} tasks</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{members} members</span>
              <span>{progress}%</span>
            </div>
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(members, 4) }).map((_, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-[8px]">{String.fromCharCode(65 + i)}</AvatarFallback>
                </Avatar>
              ))}
              {members > 4 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[8px] text-muted-foreground">
                  +{members - 4}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
