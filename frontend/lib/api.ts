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
  role?: string
  avatarUrl?: string
  avatarInitials?: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  id: string
  email:string
  projectId: string
  userId: string
  role: "OWNER" | "ADMIN" | "MEMBER"
  createdAt: string
  user: User
}

export interface Task {
  id: number;

  title: string;
  description: string;

  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

  priority:
      | "LOW"
      | "MEDIUM"
      | "HIGH"

  dueDate: string;

  assigneeId?: string;

  assignee?: User;
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

export interface ProjectData {
  name: string
  description: string
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
    const { data } = await api.get("/dashboard/stats")
  return data
}
}

// ------------------------------------------------------------------
// Projects API
// ------------------------------------------------------------------

export const projects = {
  async list(): Promise<Project[]> {
    const res = await api.get('/projects')
    console.log("hnaaaaaaaaaa",res.data)
    return res.data

  },

  async get(id: string): Promise<Project> {
    const res = await api.get(`/projects/${id}`)
    return res.data
  },

  async create(data: Partial<Project>): Promise<Project> {
    const res = await api.post('/projects', {
      name: data.name,
      description: data.description
    })
    return res.data
  },

  async update(id: string, data: Partial<Project>): Promise<Project> { 
    const res = await api.patch(`/projects/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`)
  },

  async listMembers(projectId: string): Promise<ProjectMember[]> {
    const res = await api.get(`/projects/${projectId}/members`)
    if (!res) throw new Error('Failed to fetch members')
    return res.data
  },

  async inviteMember(projectId: number, email: string): Promise<void> {
    // TODO: Replace with real API call
    // await fetch(`/api/projects/${projectId}/members`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // })
  },

  async removeMember(projectId: string, memberId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/members/${memberId}`)
  },
}

// ------------------------------------------------------------------
// Tasks API
// ------------------------------------------------------------------

export const tasks = {
  async list(projectId: string): Promise<Task[]> {
    const res = await api.get(`/projects/${projectId}/tasks`)
    return res.data
  },

  async listMyTasks(): Promise<Task[]> {
    const res = await api.get('/tasks/me')
    return res.data
  },

  async create(projectId: string, data: Partial<Task>): Promise<Task> {
    const res = await api.post(`/projects/${projectId}/tasks`, data)
    return res.data
  },

  async update(projectId: string, id: number, data: Partial<Task>): Promise<Task> {
    const res = await api.patch(`/tasks/${id}`, data)
    return res.data
  },

  async delete(projectId: string, id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
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
      fullName: data.name,
      email: data.email,
      role: "Product Designer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
