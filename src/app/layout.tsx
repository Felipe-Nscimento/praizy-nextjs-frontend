import type { Metadata } from "next"
import { Syne, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400","600","700","800"],
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Praizy — Gestão de Músicos",
  description: "Gestão de músicos e ministérios de louvor",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${syne.variable} ${inter.variable} font-inter antialiased bg-[#080c18] text-slate-100 min-h-screen`}>
        {children}
        <Toaster richColors position="bottom-center"/>
      </body>
    </html>
  )
}
