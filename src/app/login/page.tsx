"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Music } from "lucide-react"

export default function LoginPage() {
  const router    = useRouter()
  const { login } = useAuth()
  const [email, setEmail]     = useState("")
  const [senha, setSenha]     = useState("")
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    if (!email || !senha) { setErro("Preencha todos os campos"); return }
    setLoading(true)
    try {
      const res = await api.post("/auth/login", { email, senha })
      login(res.data)
      router.push("/dashboard")
    } catch (err: any) {
      setErro(err.response?.data?.detail || "Erro de conexão. Tente novamente.")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,124,246,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(0,200,224,0.06)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl grad-brand flex items-center justify-center mx-auto mb-3 glow-blue">
            <Music className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-syne text-4xl font-black grad-brand-text tracking-tight">Praizy</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de músicos e ministérios</p>
        </div>

        <div className="bg-[#0d1225] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <h2 className="font-syne text-xl font-bold mb-1">Entrar</h2>
          <p className="text-slate-400 text-sm mb-6">Acesse com as credenciais do seu gestor.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-400 text-xs font-medium">E-mail</Label>
              <Input type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111830] border-white/10 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 h-11 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-400 text-xs font-medium">Senha</Label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="bg-[#111830] border-white/10 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 h-11 text-sm pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {erro}
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-11 grad-brand glow-brand text-white font-semibold text-sm border-0 hover:opacity-90 transition-opacity">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Gestor de um novo ministério?{" "}
            <Link href="/cadastro" className="text-blue-400 hover:text-cyan-400 font-medium transition-colors">
              Cadastrar minha igreja
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
