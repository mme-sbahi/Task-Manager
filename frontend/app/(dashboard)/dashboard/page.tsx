"use client"

import { FolderKanban, ListChecks, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { RecentProjects } from "@/components/dashboard/recent-projects"

// TODO: Replace with API data — import { dashboard } from '@/lib/api'
// const [stats, setStats] = useState<DashboardStats | null>(null)
// useEffect(() => { dashboard.getStats().then(setStats) }, [])
const stats = [
  { title: "Total Projects", value: 12, icon: FolderKanban },
  { title: "Total Tasks", value: 143, icon: ListChecks },
  { title: "Tasks Completed", value: 87, icon: CheckCircle2, trend: "+12% from last week", trendUp: true },
  { title: "In Progress", value: 42, icon: Clock },
  { title: "Due Today", value: 8, icon: AlertTriangle, trend: "3 overdue", trendUp: false },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your workspace</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <RecentTasks />
        <UpcomingDeadlines />
        <RecentProjects />
      </div>
    </div>
  )
}
