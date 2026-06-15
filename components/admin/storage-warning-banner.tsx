"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import Link from "next/link"

export default function StorageWarningBanner() {
  const [warning, setWarning] = useState<{ level: "critical" | "warning"; message: string } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check once per session
    const dismissedKey = "db_warning_dismissed"
    if (sessionStorage.getItem(dismissedKey)) { setDismissed(true); return }

    fetch("/api/admin/db-stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.storage || !data.database) return
        const { storage, database, thresholds } = data
        const maxPct = Math.max(storage.percent, database.percent)
        if (maxPct >= thresholds.critical) {
          setWarning({ level: "critical", message: `Storage/DB usage is at ${maxPct}% of free tier. Action required!` })
        } else if (maxPct >= thresholds.warning) {
          setWarning({ level: "warning", message: `Storage/DB usage is at ${maxPct}% of free tier. Monitor closely.` })
        }
      })
      .catch(() => {/* silent fail */})
  }, [])

  if (dismissed || !warning) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${
        warning.level === "critical"
          ? "bg-red-600 text-white"
          : "bg-amber-500 text-white"
      }`}
    >
      <div className="flex items-center gap-2 lg:pl-64">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{warning.message}</span>
        <Link href="/admin/database" className="underline font-semibold ml-1 hover:opacity-80">
          View details
        </Link>
      </div>
      <button
        onClick={() => {
          sessionStorage.setItem("db_warning_dismissed", "1")
          setDismissed(true)
        }}
        className="hover:opacity-80"
        aria-label="Dismiss warning"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
