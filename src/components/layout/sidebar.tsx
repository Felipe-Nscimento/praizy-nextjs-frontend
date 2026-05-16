"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { initials, nivelLabel, nivelColor, cn } from "@/lib/utils"
import { Users, Calendar, RefreshCw, Church, Music, LogOut } from "lucide-react"
import { api } from "@/lib/api"

const navItems = [
  { href:"/dashboard/integrantes",  label:"Integrantes",   icon: Users },
  { href:"/dashboard/escalas",      label:"Escalas",       icon: Calendar },
  { href:"/dashboard/substituicoes",label:"Substituições", icon: RefreshCw },
]

export function Sidebar() {
  const pathname           = usePathname()
  const { auth, logout, podeGerenciarInt } = useAuth()
  const router             = useRouter()

  async function handleLogout() {
    try { await api.post("/auth/logout") } catch {}
    logout()
    router.push("/login")
  }

  if(!auth) return null
  const { integrante, igreja } = auth

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-[#0d1225] border-r border-white/5 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg grad-brand flex items-center justify-center glow-blue shrink-0">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-syne text-lg font-black grad-brand-text leading-none">Praizy</div>
            <div className="text-slate-500 text-[10px] truncate mt-0.5">{igreja.nome}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
        {podeGerenciarInt && (
          <Link href="/dashboard/igreja"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              pathname.startsWith("/dashboard/igreja")
                ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}>
            <Church className="w-4 h-4 shrink-0" />
            Igreja
          </Link>
        )}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full grad-brand flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
            {integrante.foto
              ? <img src={integrante.foto} alt="" className="w-full h-full object-cover"/>
              : initials(integrante.nome)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-200 truncate">{integrante.nome.split(" ")[0]}</div>
            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", nivelColor[integrante.nivel])}>
              {nivelLabel[integrante.nivel]}
            </span>
          </div>
          <button onClick={handleLogout}
            className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
            title="Sair">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
