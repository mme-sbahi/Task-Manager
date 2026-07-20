"use client"

import { FolderKanban, ListChecks, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { dashboard } from "@/lib/api"

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboard.getStats,
  })

  const statCards = [
    { title: "Total Projects", value: stats?.totalProjects ?? 0, icon: FolderKanban },
    { title: "Total Tasks", value: stats?.totalTasks ?? 0, icon: ListChecks },
    { title: "Tasks Completed", value: stats?.tasksCompleted ?? 0, icon: CheckCircle2 },
    { title: "In Progress", value: stats?.tasksInProgress ?? 0, icon: Clock },
    {
      title: "Due Today",
      value: stats?.tasksDueToday ?? 0,
      icon: AlertTriangle,
      trend: stats?.overdueCount ? `${stats.overdueCount} overdue` : undefined,
      trendUp: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your workspace</p>
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load your stats right now. Try refreshing.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg border bg-muted/40 animate-pulse" />
            ))
          : statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <RecentTasks />
        <UpcomingDeadlines />
        <RecentProjects />
      </div>
    </div>
  )
}