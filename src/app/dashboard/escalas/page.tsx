"use client"
import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import type { Escala, Integrante } from "@/types"
import { initials, fmtDate, getRoleCat, roleColor, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function EscalasPage() {
  const { podeCriarEscala, podeEditarEscala } = useAuth()
  const { toast }             = useToast()
  const [escalas, setEscalas] = useState<Escala[]>([])
  const [ints, setInts]       = useState<Integrante[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const [editId, setEditId]   = useState<number|null>(null)
  const [saving, setSaving]   = useState(false)
  const [data, setData]       = useState("")
  const [evento, setEvento]   = useState("")
  const [slots, setSlots]     = useState<Record<string, number>>({})

  const load = useCallback(async () => {
    try {
      const [e, i] = await Promise.all([api.get("/escalas"), api.get("/integrantes")])
      setEscalas(e.data); setInts(i.data)
    } catch { toast({ title:"Erro ao carregar", variant:"destructive" }) }
    finally { setLoading(false) }
  }, [toast])

  useEffect(() => { load() }, [load])

  const funcoes     = [...new Set(ints.flatMap(m => m.funcoes))].sort()
  const intsDeFuncao = (f: string) => ints.filter(m => m.funcoes.includes(f))

  function abrirNova() {
    setEditId(null); setData(""); setEvento(""); setSlots({}); setOpen(true)
  }

  function abrirEditar(e: Escala) {
    setEditId(e.id); setData(e.data); setEvento(e.evento||"")
    const s: Record<string,number> = {}
    e.slots.forEach(sl => { if(sl.integrante_id) s[sl.funcao] = sl.integrante_id })
    setSlots(s); setOpen(true)
  }

  async function salvar() {
    if(!data) { toast({ title:"Informe a data", variant:"destructive" }); return }
    const slotsArr = Object.entries(slots).filter(([,id])=>id).map(([funcao,integrante_id])=>({funcao,integrante_id}))
    if(!slotsArr.length) { toast({ title:"Escale ao menos um integrante", variant:"destructive" }); return }
    setSaving(true)
    try {
      if(!editId) await api.post("/escalas", { data, evento, slots: slotsArr })
      else        await api.put(`/escalas/${editId}`, { data, evento, slots: slotsArr })
      toast({ title: editId ? "Escala atualizada!" : "Escala criada! WhatsApp enviado." })
      setOpen(false); await load()
    } catch(err: any) {
      toast({ title: err.response?.data?.detail || "Erro", variant:"destructive" })
    } finally { setSaving(false) }
  }

  async function deletar(id: number) {
    if(!confirm("Remover esta escala?")) return
    try { await api.delete(`/escalas/${id}`); toast({ title:"Removida." }); await load() }
    catch { toast({ title:"Erro", variant:"destructive" }) }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl font-bold">Escalas</h1>
          <p className="text-slate-400 text-sm mt-1">Escala do ministério por data.</p>
        </div>
        {podeCriarEscala && (
          <Button onClick={abrirNova} className="grad-brand glow-brand text-white font-semibold border-0 hover:opacity-90">
            <Plus className="w-4 h-4 mr-1"/> Nova escala
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-500 text-sm py-10">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
          Carregando...
        </div>
      ) : !escalas.length ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-14 text-center">
          <div className="text-4xl mb-3 opacity-30">📅</div>
          <p className="text-slate-500 text-sm">Nenhuma escala cadastrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {escalas.map(e => (
            <div key={e.id} className="bg-[#0d1225] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-syne text-lg font-bold text-blue-300">{fmtDate(e.data)}</span>
                {e.evento && <span className="text-xs text-slate-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">{e.evento}</span>}
                <div className="ml-auto flex gap-1.5">
                  {podeEditarEscala && (
                    <Button size="sm" variant="ghost" onClick={()=>abrirEditar(e)}
                      className="text-blue-400 hover:bg-blue-500/10 h-8 w-8 p-0">
                      <Pencil className="w-3.5 h-3.5"/>
                    </Button>
                  )}
                  {podeCriarEscala && (
                    <Button size="sm" variant="ghost" onClick={()=>deletar(e.id)}
                      className="text-red-400 hover:bg-red-500/10 h-8 w-8 p-0">
                      <Trash2 className="w-3.5 h-3.5"/>
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {e.slots.map((s,i) => (
                  <div key={i} className="bg-[#111830] border border-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0d1225] border border-white/10 flex items-center justify-center text-[10px] font-bold text-blue-400 shrink-0 overflow-hidden">
                      {s.integrante_foto ? <img src={s.integrante_foto} alt="" className="w-full h-full object-cover"/> : initials(s.integrante_nome||"?")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 truncate">{s.funcao}</div>
                      <div className="text-xs font-medium text-slate-200 truncate">{s.integrante_nome||"—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0d1225] border-white/10 text-slate-100 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-syne">{editId ? "Editar escala" : "Nova escala"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-400 text-xs">Data *</Label>
                <Input type="date" value={data} onChange={e=>setData(e.target.value)}
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
              </div>
              <div>
                <Label className="text-slate-400 text-xs">Evento (opcional)</Label>
                <Input value={evento} onChange={e=>setEvento(e.target.value)} placeholder="Culto, Show..."
                  className="mt-1 bg-[#111830] border-white/10 focus-visible:border-blue-500 text-sm h-9"/>
              </div>
            </div>
            <div className="h-px bg-white/5"/>
            {funcoes.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">Cadastre integrantes com funções primeiro.</p>
            ) : (
              <div className="space-y-2">
                {funcoes.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 w-28 text-center truncate", roleColor[getRoleCat(f)])}>{f}</span>
                    <Select value={String(slots[f]||"")} onValueChange={v=>setSlots(s=>({...s,[f]:Number(v)||0}))}>
                      <SelectTrigger className="flex-1 bg-[#111830] border-white/10 h-8 text-sm focus:ring-blue-500/20">
                        <SelectValue placeholder="— Não escalar —"/>
                      </SelectTrigger>
                      <SelectContent className="bg-[#111830] border-white/10">
                        <SelectItem value="" className="text-slate-400">— Não escalar —</SelectItem>
                        {intsDeFuncao(f).map(m=>(
                          <SelectItem key={m.id} value={String(m.id)} className="text-slate-200">{m.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={()=>setOpen(false)} className="text-slate-400">Cancelar</Button>
            <Button onClick={salvar} disabled={saving} className="grad-brand text-white font-semibold border-0">
              {saving ? "Salvando..." : editId ? "Salvar alterações" : "Salvar escala"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
