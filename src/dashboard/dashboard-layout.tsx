"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { auth, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!loading && !auth) router.push("/login")
  }, [auth, loading, router])

  if(loading || !auth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c18]">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#080c18]">
      <Sidebar/>
      <main className="flex-1 overflow-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,124,246,0.08)_0%,transparent_50%)] pointer-events-none"/>
          <div className="relative max-w-4xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
