"use client"
import { useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Music, CheckCircle2, Upload } from "lucide-react"

export default function CadastroPage() {
  const [form, setForm] = useState({
    igreja_nome:"", igreja_endereco:"",
    gestor_nome:"", gestor_email:"", gestor_senha:"", gestor_senha2:""
  })
  const [logoBase64, setLogoBase64] = useState<string|null>(null)
  const [showPw,  setShowPw]  = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState("")
  const [sucesso, setSucesso] = useState(false)
  const [erros, setErros]     = useState<Record<string,string>>({})

  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if(!f) return
    const r = new FileReader()
    r.onload = ev => setLogoBase64(ev.target?.result as string)
    r.readAsDataURL(f)
  }

  function validar() {
    const e: Record<string,string> = {}
    if(!form.igreja_nome.trim())      e.igreja_nome    = "Obrigatório"
    if(!form.igreja_endereco.trim())  e.igreja_endereco = "Obrigatório"
    if(!form.gestor_nome.trim())      e.gestor_nome    = "Obrigatório"
    if(!form.gestor_email.includes("@")) e.gestor_email = "E-mail inválido"
    if(form.gestor_senha.length < 6)  e.gestor_senha   = "Mínimo 6 caracteres"
    if(form.gestor_senha !== form.gestor_senha2) e.gestor_senha2 = "Senhas não coincidem"
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErro("")
    if(!validar()) return
    setLoading(true)
    try {
      await api.post("/cadastro/solicitar", {
        igreja_nome: form.igreja_nome, igreja_endereco: form.igreja_endereco,
        igreja_logo: logoBase64, gestor_nome: form.gestor_nome,
        gestor_email: form.gestor_email, gestor_senha: form.gestor_senha
      })
      setSucesso(true)
    } catch(err: any) {
      setErro(err.response?.data?.detail || "Erro ao enviar solicitação")
    } finally { setLoading(false) }
  }

  if(sucesso) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-[#0d1225] border border-white/5 rounded-2xl p-10 animate-in fade-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
          <h2 className="font-syne text-2xl font-bold text-green-400 mb-2">Solicitação enviada!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Recebemos o cadastro da sua igreja.<br/>Nossa equipe irá analisar e aprovar em breve.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-6 border-white/10 text-slate-300 hover:bg-white/5">
              ← Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,124,246,0.15)_0%,transparent_60%)]" />
      <div className="relative z-10 w-full max-w-lg py-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl grad-brand flex items-center justify-center mx-auto mb-3 glow-blue">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-syne text-3xl font-black grad-brand-text">Praizy</h1>
          <p className="text-slate-500 text-xs mt-1">Cadastro de novo ministério</p>
        </div>

        <div className="bg-[#0d1225] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <h2 className="font-syne text-lg font-bold mb-1">Cadastrar minha igreja</h2>
          <p className="text-slate-400 text-xs mb-5">Preencha os dados. Após análise, você receberá acesso em até 24h.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Logo */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Logo da Igreja</p>
              <label className="flex flex-col items-center border-2 border-dashed border-white/10 rounded-xl p-5 cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition-all">
                <input type="file" accept="image/*" onChange={handleLogo} className="hidden"/>
                {logoBase64
                  ? <img src={logoBase64} alt="logo" className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500"/>
                  : <><Upload className="w-6 h-6 text-slate-500 mb-2"/><span className="text-xs text-slate-500">Clique para adicionar logo</span></>
                }
              </label>
            </div>

            {/* Igreja */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Dados da Igreja</p>
              <div className="space-y-3">
                <div>
                  <Label className="text-slate-400 text-xs">Nome da Igreja *</Label>
                  <Input value={form.igreja_nome} onChange={e=>set("igreja_nome",e.target.value)}
                    placeholder="Ex: Igreja Batista Central"
                    className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10"/>
                  {erros.igreja_nome && <p className="text-red-400 text-xs mt-1">{erros.igreja_nome}</p>}
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Endereço *</Label>
                  <Input value={form.igreja_endereco} onChange={e=>set("igreja_endereco",e.target.value)}
                    placeholder="Rua, número, bairro, cidade"
                    className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10"/>
                  {erros.igreja_endereco && <p className="text-red-400 text-xs mt-1">{erros.igreja_endereco}</p>}
                </div>
              </div>
            </div>

            {/* Gestor */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Dados do Gestor</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs">Nome completo *</Label>
                    <Input value={form.gestor_nome} onChange={e=>set("gestor_nome",e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10"/>
                    {erros.gestor_nome && <p className="text-red-400 text-xs mt-1">{erros.gestor_nome}</p>}
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">E-mail *</Label>
                    <Input type="email" value={form.gestor_email} onChange={e=>set("gestor_email",e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10"/>
                    {erros.gestor_email && <p className="text-red-400 text-xs mt-1">{erros.gestor_email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs">Senha *</Label>
                    <div className="relative mt-1">
                      <Input type={showPw?"text":"password"} value={form.gestor_senha} onChange={e=>set("gestor_senha",e.target.value)}
                        placeholder="Mín. 6 caracteres"
                        className="bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10 pr-9"/>
                      <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPw?<EyeOff className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}
                      </button>
                    </div>
                    {erros.gestor_senha && <p className="text-red-400 text-xs mt-1">{erros.gestor_senha}</p>}
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Confirmar senha *</Label>
                    <div className="relative mt-1">
                      <Input type={showPw2?"text":"password"} value={form.gestor_senha2} onChange={e=>set("gestor_senha2",e.target.value)}
                        placeholder="Repita"
                        className="bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10 pr-9"/>
                      <button type="button" onClick={()=>setShowPw2(!showPw2)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPw2?<EyeOff className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}
                      </button>
                    </div>
                    {erros.gestor_senha2 && <p className="text-red-400 text-xs mt-1">{erros.gestor_senha2}</p>}
                  </div>
                </div>
              </div>
            </div>

            {erro && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{erro}</div>}
            <Button type="submit" disabled={loading} className="w-full h-11 grad-brand glow-brand text-white font-semibold text-sm border-0">
              {loading ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-4">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-400 hover:text-cyan-400 font-medium transition-colors">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
