import type React from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Panel - Casant Events",
  description: "Content management system for Casant Events",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={`${inter.className} min-h-screen bg-slate-100`}>{children}</div>
}
