"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import type { Integrante } from "@/types"
import { initials, nivelLabel, nivelColor, getRoleCat, roleColor, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react"

const NIVEL_OPTS = [
  { value:"voluntario", label:"🎵 Voluntário" },
  { value:"ministro",   label:"🎤 Ministro"   },
  { value:"gestor",     label:"⚙️ Gestor"     },
]

export default function IntegrantesPage() {
  const { podeGerenciarInt }  = useAuth()
  const [lista, setLista]     = useState<Integrante[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const [editId, setEditId]   = useState<number|null>(null)
  const [saving, setSaving]   = useState(false)
  const [foto, setFoto]       = useState<string|null>(null)
  const [funcoes, setFuncoes] = useState<string[]>([])
  const [fi, setFi]           = useState("")
  const [erros, setErros]     = useState<Record<string,string>>({})
  const [form, setForm]       = useState({
    nome:"", email:"", senha:"", senha2:"", whatsapp:"", nivel:"voluntario"
  })

  const load = useCallback(async () => {
    try { const r = await api.get("/integrantes"); setLista(r.data) }
    catch { toast.error("Erro ao carregar integrantes") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const set = (k: string, v: string) => setForm(f => ({...f,[k]:v}))

  function abrirNovo() {
    setEditId(null)
    setForm({ nome:"", email:"", senha:"", senha2:"", whatsapp:"", nivel:"voluntario" })
    setFuncoes([]); setFoto(null); setErros({}); setFi("")
    setOpen(true)
  }

  function abrirEditar(m: Integrante) {
    setEditId(m.id)
    setForm({ nome:m.nome, email:m.email, senha:"", senha2:"", whatsapp:m.whatsapp||"", nivel:m.nivel })
    setFuncoes([...m.funcoes]); setFoto(m.foto||null); setErros({}); setFi("")
    setOpen(true)
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if(!f) return
    const r = new FileReader()
    r.onload = ev => setFoto(ev.target?.result as string)
    r.readAsDataURL(f)
  }

  function addFuncao() {
    const v = fi.trim()
    if(!v || funcoes.includes(v)) return
    setFuncoes(f => [...f, v]); setFi("")
  }

  function validar() {
    const e: Record<string,string> = {}
    if(!form.nome.trim())           e.nome   = "Obrigatório"
    if(!form.email.includes("@"))   e.email  = "E-mail inválido"
    if(!editId) {
      if(form.senha.length < 6)     e.senha  = "Mínimo 6 caracteres"
      if(form.senha !== form.senha2) e.senha2 = "Senhas não coincidem"
    } else if(form.senha) {
      if(form.senha.length < 6)     e.senha  = "Mínimo 6 caracteres"
      if(form.senha !== form.senha2) e.senha2 = "Senhas não coincidem"
    }
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function salvar() {
    if(!validar()) return
    setSaving(true)
    try {
      const p: any = { nome:form.nome, email:form.email, nivel:form.nivel, whatsapp:form.whatsapp||null, funcoes, foto }
      if(!editId || form.senha) p.senha = form.senha
      if(!editId) await api.post("/integrantes", p)
      else        await api.put(`/integrantes/${editId}`, p)
      toast.success(editId ? "Atualizado!" : "Cadastrado!")
      setOpen(false); await load()
    } catch(err: any) {
      toast.error(err.response?.data?.detail || "Erro ao salvar")
    } finally { setSaving(false) }
  }

  async function deletar(id: number) {
    if(!confirm("Remover este integrante?")) return
    try { await api.delete(`/integrantes/${id}`); toast.success("Removido."); await load() }
    catch { toast.error("Erro ao remover") }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl font-bold">Integrantes</h1>
          <p className="text-slate-400 text-sm mt-1">Músicos e colaboradores do ministério.</p>
        </div>
        {podeGerenciarInt && (
          <Button onClick={abrirNovo} className="grad-brand glow-brand text-white font-semibold border-0 hover:opacity-90">
            <Plus className="w-4 h-4 mr-1"/> Novo integrante
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 text-sm py-10">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
          Carregando...
        </div>
      ) : !lista.length ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-14 text-center">
          <div className="text-4xl mb-3 opacity-30">👥</div>
          <p className="text-slate-500 text-sm">Nenhum integrante cadastrado ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lista.map(m => (
            <div key={m.id}
              className="bg-[#0d1225] border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:border-white/10 transition-all group relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
              <div className="w-11 h-11 rounded-full bg-[#111830] border border-white/10 flex items-center justify-center font-syne text-base font-bold text-blue-400 shrink-0 overflow-hidden">
                {m.foto ? <img src={m.foto} alt="" className="w-full h-full object-cover"/> : initials(m.nome)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-syne font-semibold text-sm">{m.nome}</span>
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", nivelColor[m.nivel])}>
                    {nivelLabel[m.nivel]}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-1.5">
                  {m.email && <span>✉️ {m.email}</span>}
                  {m.whatsapp && <span>📱 {m.whatsapp}</span>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.funcoes.map(f => (
                    <span key={f} className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", roleColor[getRoleCat(f)])}>{f}</span>
                  ))}
                </div>
              </div>
              {podeGerenciarInt && (
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => abrirEditar(m)}
                    className="text-blue-400 hover:bg-blue-500/10 h-8 w-8 p-0">
                    <Pencil className="w-3.5 h-3.5"/>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deletar(m.id)}
                    className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0d1225] border-white/10 text-slate-100 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-syne">{editId ? "Editar integrante" : "Novo integrante"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex flex-col items-center border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-blue-500/40 hover:bg-blue-500/5 transition-all">
              <input type="file" accept="image/*" onChange={handleFoto} className="hidden"/>
              {foto
                ? <img src={foto} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"/>
                : <><Upload className="w-5 h-5 text-slate-500 mb-1.5"/><span className="text-xs text-slate-500">Foto do integrante</span></>}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400 text-xs">Nome *</Label>
                <Input value={form.nome} onChange={e=>set("nome",e.target.value)} placeholder="Nome completo"
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
                {erros.nome && <p className="text-red-400 text-xs mt-1">{erros.nome}</p>}
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Nível *</Label>
                <Select value={form.nivel} onValueChange={v=>set("nivel",v)}>
                  <SelectTrigger className="mt-1 bg-[#111830] border-white/10 h-9 text-sm">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent className="bg-[#111830] border-white/10">
                    {NIVEL_OPTS.map(o=><SelectItem key={o.value} value={o.value} className="text-slate-200">{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400 text-xs">E-mail *</Label>
                <Input type="email" value={form.email} onChange={e=>set("email",e.target.value)}
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
                {erros.email && <p className="text-red-400 text-xs mt-1">{erros.email}</p>}
              </div>
              <div>
                <Label className="text-slate-400 text-xs">WhatsApp</Label>
                <Input value={form.whatsapp} onChange={e=>set("whatsapp",e.target.value)} placeholder="(11) 99999-9999"
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400 text-xs">
                  Senha * {editId && <span className="text-slate-600">(em branco p/ manter)</span>}
                </Label>
                <Input type="password" value={form.senha} onChange={e=>set("senha",e.target.value)}
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
                {erros.senha && <p className="text-red-400 text-xs mt-1">{erros.senha}</p>}
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Confirmar senha *</Label>
                <Input type="password" value={form.senha2} onChange={e=>set("senha2",e.target.value)}
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
                {erros.senha2 && <p className="text-red-400 text-xs mt-1">{erros.senha2}</p>}
              </div>
            </div>
            <div>
              <Label className="text-slate-400 text-xs">Funções / Instrumentos</Label>
              <div className="flex gap-2 mt-1">
                <Input value={fi} onChange={e=>setFi(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addFuncao()}}}
                  placeholder="Ex: Guitarra, Vocal..."
                  className="bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
                <Button type="button" onClick={addFuncao} variant="outline" size="sm"
                  className="border-white/10 hover:bg-white/5 text-slate-300 shrink-0">+ Add</Button>
              </div>
              {funcoes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {funcoes.map((f,i) => (
                    <span key={i} className={cn("flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full", roleColor[getRoleCat(f)])}>
                      {f}
                      <button onClick={()=>setFuncoes(fs=>fs.filter((_,j)=>j!==i))} className="hover:opacity-100 opacity-60">
                        <X className="w-2.5 h-2.5"/>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={()=>setOpen(false)} className="text-slate-400 hover:text-slate-200">Cancelar</Button>
            <Button onClick={salvar} disabled={saving} className="grad-brand text-white font-semibold border-0 hover:opacity-90">
              {saving ? "Salvando..." : editId ? "Salvar alterações" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
