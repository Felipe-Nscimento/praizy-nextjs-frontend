import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Nivel } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(nome: string): string {
  return nome.trim().split(" ").slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?"
}

export function fmtDate(d: string): string {
  if (!d) return ""
  const [y, m, dd] = d.split("-")
  return `${dd}/${m}/${y}`
}

export function getRoleCat(r: string): "instrumento" | "vocal" | "outro" {
  const v = r.toLowerCase()
  if (["voz","vocal","cantor","cantora","canto"].some((x) => v.includes(x))) return "vocal"
  if (["guitar","baixo","bateria","teclado","piano","sax","trompete","violino",
       "viola","cello","flauta","pandeiro","percuss","violão","cavaquinho",
       "zabumba","acordeon","contrabaixo","trombone","clarinete"].some((x) => v.includes(x)))
    return "instrumento"
  return "outro"
}

export const nivelLabel: Record<Nivel, string> = {
  gestor:    "Gestor",
  ministro:  "Ministro",
  voluntario:"Voluntário",
}

export const nivelColor: Record<Nivel, string> = {
  gestor:    "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  ministro:  "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
  voluntario:"bg-white/5 text-slate-400 border border-white/10",
}

export const roleColor: Record<string, string> = {
  instrumento: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
  vocal:       "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
  outro:       "bg-amber-500/10 text-amber-300 border border-amber-500/20",
}
