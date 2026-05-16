"use client"
import { useState, useEffect, useCallback } from "react"
import type { Integrante } from "@/types"

interface AuthData {
  token: string
  integrante: Integrante
  igreja: { nome: string; status: string }
}

export function useAuth() {
  const [auth, setAuth]       = useState<AuthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token  = localStorage.getItem("praizy_token")
    const user   = localStorage.getItem("praizy_user")
    const igreja = localStorage.getItem("praizy_igreja")
    if (token && user) {
      try { setAuth({ token, integrante: JSON.parse(user), igreja: JSON.parse(igreja || "{}") }) }
      catch {}
    }
    setLoading(false)
  }, [])

  const login = useCallback((data: AuthData) => {
    localStorage.setItem("praizy_token",  data.token)
    localStorage.setItem("praizy_user",   JSON.stringify(data.integrante))
    localStorage.setItem("praizy_igreja", JSON.stringify(data.igreja))
    setAuth(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("praizy_token")
    localStorage.removeItem("praizy_user")
    localStorage.removeItem("praizy_igreja")
    setAuth(null)
  }, [])

  const podeGerenciarInt = auth?.integrante.nivel === "gestor"
  const podeCriarEscala  = auth?.integrante.nivel === "gestor"
  const podeEditarEscala = ["gestor","ministro"].includes(auth?.integrante.nivel || "")

  return { auth, loading, login, logout, podeGerenciarInt, podeCriarEscala, podeEditarEscala }
}
