"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2, CheckSquare } from "lucide-react"
import { setAuthCookie } from "@/lib/auth-cookie"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // TODO: Replace with real API call
    // import { auth } from '@/lib/api'
    // try {
    //   const { user, token } = await auth.login(email, password)
    //   setAuthCookie(token)
    //   router.push('/dashboard')
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Invalid email or password')
    // } finally {
    //   setIsLoading(false)
    // }

    // Mock auth for UI demo
    setTimeout(() => {
      const mockToken = "mock-token-" + Math.random().toString(36).substring(2)
      setAuthCookie(mockToken)
      setIsLoading(false)
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-900 font-bold text-sm">TF</div>
            <span className="text-sm font-semibold text-white">TaskFlow</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed text-zinc-300">&ldquo;TaskFlow transformed how our team tracks work. It&rsquo;s become our single source of truth.&rdquo;</p>
            <footer className="text-sm text-zinc-500"><strong className="text-zinc-400">Alex Chen</strong> — Lead Engineer, Arcadia</footer>
          </blockquote>
        </div>
        <div className="relative flex items-center gap-6 text-zinc-600 text-xs">
          <span className="flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5 text-emerald-400" /> 12K+ tasks tracked</span>
          <span className="flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5 text-emerald-400" /> 500+ teams</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm">TF</div>
              <span className="text-sm font-semibold">TaskFlow</span>
            </div>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} autoComplete="email" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Forgot password?</Link>
              </div>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} autoComplete="current-password" className="h-10" />
            </div>
            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><Separator /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-zinc-400">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10" disabled>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </Button>
              <Button variant="outline" className="h-10" disabled>
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </Button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
