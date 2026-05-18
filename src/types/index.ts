export type Nivel = "gestor" | "ministro" | "voluntario"

export interface Igreja {
  id: number
  nome: string
  endereco: string
  logo?: string
  status: "pendente" | "ativa" | "rejeitada"
}

export interface Integrante {
  id: number
  nome: string
  email: string
  whatsapp?: string
  nivel: Nivel
  foto?: string
  funcoes: string[]
  igreja_id: number
}

export interface EscalaSlot {
  funcao: string
  integrante_id?: number
  integrante_nome?: string
  integrante_foto?: string
}

export interface Escala {
  id: number
  data: string
  evento?: string
  slots: EscalaSlot[]
}

export interface Substituto {
  funcao: string
  substitutos: { id: number; nome: string }[]
}
