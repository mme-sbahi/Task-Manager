/* ============================================================
* API Service — TaskFlow
 *
 * All backend API calls go through this module.
 * Each function is a placeholder — replace the mock implementation
 * with real fetch/axios calls when the backend is ready.
 *
 * Example usage in components:
 *   import { auth } from "@/lib/api"
 *   await auth.login(email, password)
 * ============================================================ */

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------


import { api } from "@/lib/axios"
import { setAuthTokens, clearAuthTokens } from "@/lib/auth-cookie"

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: number
  name: string
  description: string
  progress: number
  tasks: number
  members: number
  status: string
}

export interface Task {
  id: number
  title: string
  description: string
  priority: "urgent" | "high" | "medium" | "low"
  dueDate: string
  assignee: string
  status: string
}

export interface DashboardStats {
  totalProjects: number
  totalTasks: number
  tasksCompleted: number
  tasksInProgress: number
  tasksDueToday: number
  overdueCount: number
}

export interface ProfileData {
  name: string
  email: string
  avatar?: File
}

export interface PasswordData {
  currentPassword: string
  newPassword: string
}

// ------------------------------------------------------------------
// Auth API
// ------------------------------------------------------------------

export const auth = {
  async login(email: string, password: string): Promise<{ user: User }> {
    const { data } = await api.post("/auth/login", { email, password })
    setAuthTokens(data.accessToken, data.refreshToken)
    return { user: data.user }
  },

  async register(fullName: string, email: string, password: string): Promise<{ user: User }> {
    const { data } = await api.post("/auth/register", { fullName, email, password })
    setAuthTokens(data.accessToken, data.refreshToken)
    return { user: data.user }
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
    clearAuthTokens()
  },
}

// ------------------------------------------------------------------
// Dashboard API
// ------------------------------------------------------------------

export const dashboard = {
  async getStats(): Promise<DashboardStats> {
    // TODO: Replace with real API call
    // const res = await fetch('/api/dashboard/stats')
    // if (!res.ok) throw new Error('Failed to fetch dashboard stats')
    // return res.json()

    return {
      totalProjects: 12,
      totalTasks: 143,
      tasksCompleted: 87,
      tasksInProgress: 42,
      tasksDueToday: 8,
      overdueCount: 3,
    }
  },
}

// ------------------------------------------------------------------
// Projects API
// ------------------------------------------------------------------

export const projects = {
  async list(): Promise<Project[]> {
    // TODO: Replace with real API call
    // const res = await fetch('/api/projects')
    // if (!res.ok) throw new Error('Failed to fetch projects')
    // return res.json()

    return [
      { id: 1, name: "Design System", description: "Component library and design tokens", progress: 80, tasks: 24, members: 4, status: "Active" },
      { id: 2, name: "Mobile App v2", description: "React Native rewrite with new features", progress: 45, tasks: 36, members: 6, status: "In Progress" },
      { id: 3, name: "API Gateway", description: "Unified API layer for microservices", progress: 90, tasks: 18, members: 3, status: "Active" },
      { id: 4, name: "User Dashboard", description: "Customer-facing analytics dashboard", progress: 30, tasks: 42, members: 5, status: "Planning" },
      { id: 5, name: "Auth Service", description: "OAuth 2.0 and SSO integration", progress: 60, tasks: 15, members: 2, status: "Active" },
      { id: 6, name: "Notification System", description: "Email, push and in-app notifications", progress: 15, tasks: 28, members: 4, status: "Planning" },
    ]
  },

  async get(id: number): Promise<Project> {
    // TODO: Replace with real API call
    // const res = await fetch(`/api/projects/${id}`)
    // if (!res.ok) throw new Error('Project not found')
    // return res.json()

    const mock: Record<number, Project> = {
      1: { id: 1, name: "Design System", description: "Component library and design tokens", progress: 80, tasks: 24, members: 4, status: "Active" },
      2: { id: 2, name: "Mobile App v2", description: "React Native rewrite with new features", progress: 45, tasks: 36, members: 6, status: "In Progress" },
      3: { id: 3, name: "API Gateway", description: "Unified API layer for microservices", progress: 90, tasks: 18, members: 3, status: "Active" },
    }
    const project = mock[id]
    if (!project) throw new Error("Project not found")
    return project
  },

  async create(data: Partial<Project>): Promise<Project> {
    // TODO: Replace with real API call
    // const res = await fetch('/api/projects', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    // if (!res.ok) throw new Error('Failed to create project')
    // return res.json()

    return { id: Date.now(), ...data } as Project
  },

  async update(id: number, data: Partial<Project>): Promise<Project> {
    // TODO: Replace with real API call
    // const res = await fetch(`/api/projects/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    // if (!res.ok) throw new Error('Failed to update project')
    // return res.json()

    return { id, ...data } as Project
  },

  async delete(id: number): Promise<void> {
    // TODO: Replace with real API call
    // await fetch(`/api/projects/${id}`, { method: 'DELETE' })
  },
}

// ------------------------------------------------------------------
// Tasks API
// ------------------------------------------------------------------

export const tasks = {
  async list(projectId?: number): Promise<Task[]> {
    // TODO: Replace with real API call
    // const params = projectId ? `?projectId=${projectId}` : ''
    // const res = await fetch(`/api/tasks${params}`)
    // if (!res.ok) throw new Error('Failed to fetch tasks')
    // return res.json()

    return [
      { id: 1, title: "Design system color tokens", description: "Update color palette in design tokens", priority: "high", dueDate: "2026-07-20", assignee: "SA", status: "todo" },
      { id: 2, title: "API rate limiting", description: "Implement rate limiting middleware", priority: "urgent", dueDate: "2026-07-18", assignee: "MK", status: "todo" },
      { id: 3, title: "User onboarding flow", description: "Redesign the onboarding experience", priority: "medium", dueDate: "2026-07-22", assignee: "AL", status: "in-progress" },
      { id: 4, title: "Database migration script", description: "Write migration for v2 schema", priority: "high", dueDate: "2026-07-17", assignee: "JD", status: "review" },
      { id: 5, title: "Mobile responsive nav", description: "Make navigation responsive on mobile", priority: "low", dueDate: "2026-07-25", assignee: "SA", status: "done" },
      { id: 6, title: "Dark mode support", description: "Add dark mode theme support", priority: "medium", dueDate: "2026-07-19", assignee: "MK", status: "in-progress" },
    ]
  },

  async create(data: Partial<Task>): Promise<Task> {
    // TODO: Replace with real API call
    // const res = await fetch('/api/tasks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    // if (!res.ok) throw new Error('Failed to create task')
    // return res.json()

    return { id: Date.now(), ...data } as Task
  },

  async update(id: number, data: Partial<Task>): Promise<Task> {
    // TODO: Replace with real API call
    // const res = await fetch(`/api/tasks/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    // if (!res.ok) throw new Error('Failed to update task')
    // return res.json()

    return { id, ...data } as Task
  },

  async delete(id: number): Promise<void> {
    // TODO: Replace with real API call
    // await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  },
}

// ------------------------------------------------------------------
// Settings API
// ------------------------------------------------------------------

export const settings = {
  async updateProfile(data: ProfileData): Promise<User> {
    // TODO: Replace with real API call
    // const formData = new FormData()
    // formData.append('name', data.name)
    // formData.append('email', data.email)
    // if (data.avatar) formData.append('avatar', data.avatar)
    // const res = await fetch('/api/user/profile', {
    //   method: 'PATCH',
    //   body: formData,
    // })
    // if (!res.ok) throw new Error('Failed to update profile')
    // return res.json()

    return {
      id: "1",
      name: data.name,
      email: data.email,
      role: "Product Designer",
      avatarInitials: data.name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    }
  },

  async changePassword(data: PasswordData): Promise<void> {
    // TODO: Replace with real API call
    // const res = await fetch('/api/user/password', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    // if (!res.ok) throw new Error('Failed to change password')
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    // TODO: Replace with real API call
    // const formData = new FormData()
    // formData.append('avatar', file)
    // const res = await fetch('/api/user/avatar', {
    //   method: 'POST',
    //   body: formData,
    // })
    // if (!res.ok) throw new Error('Failed to upload avatar')
    // return res.json()

    return { url: URL.createObjectURL(file) }
  },
}
