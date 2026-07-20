"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Bell, Check, X, Loader2, User, FolderKanban } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { invitations as invitationsApi } from "@/lib/api"

export function NotificationDropdown() {
  const queryClient = useQueryClient()

  const { data: pendingInvitations = [], isLoading } = useQuery({
    queryKey: ["pending-invitations"],
    queryFn: invitationsApi.listMyInvitations,
    refetchInterval: 60_000,
  })

  const acceptMutation = useMutation({
    mutationFn: (id: string) => invitationsApi.accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] })
      toast.success("Invitation accepted", {
        description: "You can now access the project.",
      })
    },
    onError: () => {
      toast.error("Failed to accept invitation")
    },
  })

  const declineMutation = useMutation({
    mutationFn: (id: string) => invitationsApi.decline(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] })
      toast.success("Invitation declined")
    },
    onError: () => {
      toast.error("Failed to decline invitation")
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingInvitations.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {pendingInvitations.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            {pendingInvitations.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground">
                {pendingInvitations.length} pending
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : pendingInvitations.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          pendingInvitations.map((invitation) => (
            <div key={invitation.id} className="px-2 py-2.5 border-b last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <FolderKanban className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{invitation.projectName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {invitation.inviterName
                      ? `Invited by ${invitation.inviterName}`
                      : "You've been invited to this project"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => acceptMutation.mutate(invitation.id)}
                      disabled={acceptMutation.isPending || declineMutation.isPending}
                    >
                      {acceptMutation.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => declineMutation.mutate(invitation.id)}
                      disabled={acceptMutation.isPending || declineMutation.isPending}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
