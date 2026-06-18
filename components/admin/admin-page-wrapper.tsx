"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface AdminPageWrapperProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export default function AdminPageWrapper({
  title,
  description,
  action,
  children,
  backHref,
  backLabel,
}: AdminPageWrapperProps) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-white/[0.06] bg-[#0f0f0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {backLabel || "Back"}
            </Link>
          )}
          <div>
            <h1 className="text-sm font-semibold text-white/90 leading-tight">{title}</h1>
            {description && <p className="text-xs text-white/35 leading-tight">{description}</p>}
          </div>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </header>

      <main className="px-6 py-6 max-w-6xl mx-auto">{children}</main>
    </div>
  )
}
