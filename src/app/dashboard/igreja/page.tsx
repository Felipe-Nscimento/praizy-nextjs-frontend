"use client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import type { Igreja } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

export default function IgrejaPage() {
  const { podeGerenciarInt } = useAuth()
  const [igreja, setIgreja] = useState<Igreja|null>(null)
  const [nome, setNome]     = useState("")
  const [end, setEnd]       = useState("")
  const [logo, setLogo]     = useState<string|null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get("/minha-igreja").then(r => {
      setIgreja(r.data); setNome(r.data.nome); setEnd(r.data.endereco||""); setLogo(r.data.logo||null)
    }).catch(() => toast.error("Erro ao carregar"))
  }, [])

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if(!f) return
    const r = new FileReader()
    r.onload = ev => setLogo(ev.target?.result as string)
    r.readAsDataURL(f)
  }

  async function salvar() {
    if(!nome.trim()) { toast.error("Informe o nome da igreja"); return }
    setSaving(true)
    try {
      await api.put("/minha-igreja", { nome, endereco: end, logo })
      toast.success("Igreja atualizada!")
    } catch { toast.error("Erro ao salvar") }
    finally { setSaving(false) }
  }

  if(!podeGerenciarInt) return (
    <div className="border border-dashed border-white/10 rounded-2xl p-14 text-center">
      <div className="text-4xl mb-3 opacity-30">⛪</div>
      <p className="text-slate-500 text-sm">Sem permissão para acessar esta seção.</p>
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-syne text-2xl font-bold">Minha Igreja</h1>
        <p className="text-slate-400 text-sm mt-1">Informações e configurações do ministério.</p>
      </div>

      {igreja && (
        <div className="bg-[#0d1225] border border-white/5 rounded-2xl p-5 mb-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500"/>
          <div className="w-14 h-14 rounded-xl bg-[#111830] border border-white/10 flex items-center justify-center text-2xl overflow-hidden shrink-0">
            {logo ? <img src={logo} alt="" className="w-full h-full object-cover rounded-xl"/> : "⛪"}
          </div>
          <div>
            <div className="font-syne text-lg font-bold">{igreja.nome}</div>
            <div className="text-slate-400 text-sm mt-0.5">📍 {igreja.endereco||"Endereço não informado"}</div>
          </div>
        </div>
      )}

      <div className="bg-[#0d1225] border border-white/5 rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Editar informações</p>
        <div>
          <Label className="text-slate-400 text-xs">Logo</Label>
          <label className="mt-1 flex flex-col items-center border-2 border-dashed border-white/10 rounded-xl p-5 cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition-all">
            <input type="file" accept="image/*" onChange={handleLogo} className="hidden"/>
            {logo
              ? <img src={logo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-blue-500"/>
              : <><Upload className="w-5 h-5 text-slate-500 mb-1.5"/><span className="text-xs text-slate-500">Clique para trocar o logo</span></>}
          </label>
        </div>
        <div>
          <Label className="text-slate-400 text-xs">Nome da Igreja</Label>
          <Input value={nome} onChange={e=>setNome(e.target.value)}
            className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10"/>
        </div>
        <div>
          <Label className="text-slate-400 text-xs">Endereço</Label>
          <Input value={end} onChange={e=>setEnd(e.target.value)} placeholder="Rua, número, bairro, cidade"
            className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-10"/>
        </div>
        <Button onClick={salvar} disabled={saving} className="grad-brand glow-brand text-white font-semibold border-0">
          {saving ? "Salvando..." : "Salvar informações"}
        </Button>
      </div>
    </div>
  )
}
