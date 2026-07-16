import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentTasks = [
  { id: 1, title: "Design system color tokens update", priority: "high", status: "In Progress", assignee: "SA", due: "Today" },
  { id: 2, title: "API rate limiting implementation", priority: "urgent", status: "Review", assignee: "MK", due: "Tomorrow" },
  { id: 3, title: "User onboarding flow redesign", priority: "medium", status: "Todo", assignee: "AL", due: "In 3 days" },
  { id: 4, title: "Database migration script", priority: "high", status: "Done", assignee: "JD", due: "Yesterday" },
  { id: 5, title: "Mobile responsive navigation", priority: "low", status: "Todo", assignee: "SA", due: "Next week" },
]

export function RecentTasks() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px]">{task.assignee}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground">Due {task.due}</p>
              </div>
              <Badge
                variant={
                  task.priority === "urgent" ? "destructive"
                  : task.priority === "high" ? "warning"
                  : task.priority === "medium" ? "default" : "secondary"
                }
                className="text-[10px] px-1.5 py-0"
              >
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
