import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, AlertCircle } from "lucide-react"

const deadlines = [
  { id: 1, title: "Q2 Review Presentation", date: "Today", urgent: true },
  { id: 2, title: "Client feedback implementation", date: "Tomorrow", urgent: false },
  { id: 3, title: "Sprint retrospective notes", date: "In 2 days", urgent: false },
  { id: 4, title: "Deploy v2.1 to staging", date: "In 4 days", urgent: false },
]

export function UpcomingDeadlines() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {deadlines.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              {item.urgent ? (
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              ) : (
                <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
              </div>
              <Badge variant={item.urgent ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                {item.date}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
