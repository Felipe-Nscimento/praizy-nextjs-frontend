"use client"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Integrante, Substituto } from "@/types"
import { getRoleCat, roleColor, cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function SubstituicoesPage() {
  const { toast }             = useToast()
  const [ints, setInts]       = useState<Integrante[]>([])
  const [sel, setSel]         = useState("")
  const [subs, setSubs]       = useState<Substituto[]>([])
  const [todos, setTodos]     = useState<{funcao:string;nomes:string[]}[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get("/integrantes").then(r => {
      setInts(r.data)
      const map: Record<string,Set<string>> = {}
      r.data.forEach((m: Integrante) => m.funcoes.forEach(f => {
        if(!map[f]) map[f] = new Set(); map[f].add(m.nome)
      }))
      setTodos(Object.entries(map)
        .filter(([,ns]) => ns.size > 1)
        .map(([funcao,ns]) => ({ funcao, nomes:[...ns] }))
        .sort((a,b) => a.funcao.localeCompare(b.funcao)))
    }).catch(() => toast({ title:"Erro ao carregar", variant:"destructive" }))
  }, [toast])

  async function buscar(id: string) {
    setSel(id); if(!id){ setSubs([]); return }
    setLoading(true)
    try { const r = await api.get(`/substitutos/${id}`); setSubs(r.data) }
    catch { toast({ title:"Erro ao buscar", variant:"destructive" }) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-syne text-2xl font-bold">Substituições</h1>
        <p className="text-slate-400 text-sm mt-1">Quem pode substituir cada integrante.</p>
      </div>

      <div className="bg-[#0d1225] border border-white/5 rounded-2xl p-5 mb-4">
        <Label className="text-slate-400 text-xs mb-2 block">Selecione um integrante</Label>
        <Select value={sel} onValueChange={buscar}>
          <SelectTrigger className="bg-[#111830] border-white/10 h-10 text-sm focus:ring-blue-500/20">
            <SelectValue placeholder="— Escolha um integrante —"/>
          </SelectTrigger>
          <SelectContent className="bg-[#111830] border-white/10">
            {ints.map(m => <SelectItem key={m.id} value={String(m.id)} className="text-slate-200">{m.nome}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-500 text-sm py-4">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
          Buscando...
        </div>
      )}

      {subs.length > 0 && (
        <div className="space-y-2 mb-5">
          {subs.map(item => (
            <div key={item.funcao} className="bg-[#0d1225] border border-white/5 rounded-xl p-4">
              <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full mb-3 inline-block", roleColor[getRoleCat(item.funcao)])}>
                {item.funcao}
              </span>
              <div className="flex flex-wrap gap-2">
                {item.substitutos.length
                  ? item.substitutos.map(s => (
                      <span key={s.id} className="text-sm px-3 py-1 rounded-full bg-[#111830] border border-white/5 text-slate-300">{s.nome}</span>
                    ))
                  : <span className="text-sm text-slate-500 italic">Nenhum substituto disponível</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-white/5 my-5"/>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Todos os substitutos por função</p>

      {!todos.length ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-10 text-center">
          <div className="text-3xl mb-2 opacity-30">🔄</div>
          <p className="text-slate-500 text-sm">Nenhuma função tem mais de um integrante ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map(({funcao, nomes}) => (
            <div key={funcao} className="bg-[#0d1225] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", roleColor[getRoleCat(funcao)])}>{funcao}</span>
                <span className="text-[11px] text-slate-500">{nomes.length} integrantes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {nomes.map(n => (
                  <span key={n} className="text-sm px-3 py-1 rounded-full bg-[#111830] border border-white/5 text-slate-300">{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
