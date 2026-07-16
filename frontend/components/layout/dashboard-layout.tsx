"use client"

import { useState } from "react"
import { ThemeProvider } from "next-themes"
import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex h-screen overflow-hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:flex">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/30">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
