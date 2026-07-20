"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { auth, type User } from "@/lib/api"
import { getInitials } from "@/lib/utils"

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: auth.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const handleLogout = async () => {
    try {
      await auth.logout()
    } catch {
      // Even if the API call fails, clear local state
    }
    queryClient.clear()
    router.push("/login")
  }

  return {
    user: user ?? null,
    isLoading,
    isError,
    initials: user?.fullName ? getInitials(user.fullName) : "??",
    logout: handleLogout,
  }
}
