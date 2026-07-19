"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearAuthTokens } from "@/lib/auth-cookie"

interface TopNavProps {
  onMenuToggle: () => void
}

export function TopNav({ onMenuToggle }: TopNavProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    clearAuthTokens()
    router.push("/login")
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks, projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9"
        />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Sahil A.</span>
                <span className="text-xs font-normal text-muted-foreground">sahil@company.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
