"use client"

import { useEffect, useState, useCallback } from "react"
import {
  AlertTriangle, RefreshCw, Database, HardDrive,
  Wifi, Table2, CheckCircle2, XCircle, Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface DbStats {
  limits: { storage_mb: number; egress_mb: number; db_size_mb: number }
  thresholds: { warning: number; critical: number }
  storage: { total_mb: number; limit_mb: number; percent: number; buckets: { bucket: string; mb: number }[] }
  database: { total_rows: number; estimated_mb: number; limit_mb: number; percent: number; tables: { table: string; count: number }[] }
  generated_at: string
}

function StatusBadge({ percent, warning, critical }: { percent: number; warning: number; critical: number }) {
  if (percent >= critical) return <Badge className="bg-red-100 text-red-700 border-red-200">Critical</Badge>
  if (percent >= warning) return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Warning</Badge>
  return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Healthy</Badge>
}

function UsageBar({ percent, warning, critical }: { percent: number; warning: number; critical: number }) {
  const color = percent >= critical
    ? "bg-red-500"
    : percent >= warning
      ? "bg-amber-400"
      : "bg-emerald-500"

  return (
    <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
      {/* warning marker */}
      <div
        className="absolute top-0 h-full w-0.5 bg-amber-400/60"
        style={{ left: `${warning}%` }}
        title={`Warning at ${warning}%`}
      />
      {/* critical marker */}
      <div
        className="absolute top-0 h-full w-0.5 bg-red-400/60"
        style={{ left: `${critical}%` }}
        title={`Critical at ${critical}%`}
      />
    </div>
  )
}

function AlertBanner({ stats }: { stats: DbStats }) {
  const issues: { level: "critical" | "warning"; message: string }[] = []

  if (stats.storage.percent >= stats.thresholds.critical) {
    issues.push({ level: "critical", message: `File storage is at ${stats.storage.percent}% — upload limit nearly reached!` })
  } else if (stats.storage.percent >= stats.thresholds.warning) {
    issues.push({ level: "warning", message: `File storage at ${stats.storage.percent}% of free tier limit.` })
  }

  if (stats.database.percent >= stats.thresholds.critical) {
    issues.push({ level: "critical", message: `Database size is at ${stats.database.percent}% — consider upgrading!` })
  } else if (stats.database.percent >= stats.thresholds.warning) {
    issues.push({ level: "warning", message: `Database at ${stats.database.percent}% of free tier limit.` })
  }

  if (issues.length === 0) return null

  return (
    <div className="space-y-2 mb-6">
      {issues.map((issue, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            issue.level === "critical"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{issue.level === "critical" ? "Critical Alert" : "Warning"}</p>
            <p className="text-sm mt-0.5">{issue.message} Clean up unused files or upgrade your Supabase plan.</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DatabaseMonitor() {
  const [stats, setStats] = useState<DbStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/db-stats")
      if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`)
      const data = await res.json()
      setStats(data)
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchStats])

  const FREE_TIER_NOTE = "Supabase free tier: 500 MB database · 1 GB file storage · 5 GB egress/month"

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Database Monitor</h1>
          <p className="text-sm text-slate-500 mt-0.5">{FREE_TIER_NOTE}</p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {lastRefreshed.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-6">
          <XCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && !stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {stats && (
        <>
          <AlertBanner stats={stats} />

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* File Storage */}
            <Card className={`border-2 ${stats.storage.percent >= stats.thresholds.critical ? "border-red-200" : stats.storage.percent >= stats.thresholds.warning ? "border-amber-200" : "border-slate-200"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <HardDrive className="w-4 h-4" />
                    <CardTitle className="text-sm font-medium">File Storage</CardTitle>
                  </div>
                  <StatusBadge percent={stats.storage.percent} warning={stats.thresholds.warning} critical={stats.thresholds.critical} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-800">{stats.storage.total_mb} <span className="text-base font-normal text-slate-500">MB</span></p>
                <p className="text-xs text-slate-400 mb-3">of {stats.limits.storage_mb} MB free tier</p>
                <UsageBar percent={stats.storage.percent} warning={stats.thresholds.warning} critical={stats.thresholds.critical} />
                <p className="text-xs text-slate-500 mt-1.5 text-right">{stats.storage.percent}% used</p>
              </CardContent>
            </Card>

            {/* Database */}
            <Card className={`border-2 ${stats.database.percent >= stats.thresholds.critical ? "border-red-200" : stats.database.percent >= stats.thresholds.warning ? "border-amber-200" : "border-slate-200"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Database className="w-4 h-4" />
                    <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                  </div>
                  <StatusBadge percent={stats.database.percent} warning={stats.thresholds.warning} critical={stats.thresholds.critical} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-800">{stats.database.total_rows.toLocaleString()} <span className="text-base font-normal text-slate-500">rows</span></p>
                <p className="text-xs text-slate-400 mb-3">~{stats.database.estimated_mb} MB estimated of {stats.limits.db_size_mb} MB free tier</p>
                <UsageBar percent={stats.database.percent} warning={stats.thresholds.warning} critical={stats.thresholds.critical} />
                <p className="text-xs text-slate-500 mt-1.5 text-right">{stats.database.percent}% estimated</p>
              </CardContent>
            </Card>

            {/* Egress — read-only info card */}
            <Card className="border-2 border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Wifi className="w-4 h-4" />
                    <CardTitle className="text-sm font-medium">Egress (Monthly)</CardTitle>
                  </div>
                  <Badge className="bg-slate-100 text-slate-600 border-slate-200">Info</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-800">5 <span className="text-base font-normal text-slate-500">GB</span></p>
                <p className="text-xs text-slate-400 mb-3">free tier monthly limit</p>
                <div className="text-xs text-slate-500 bg-slate-50 rounded-md p-2.5 leading-relaxed">
                  Egress is consumed when visitors load images and data. Monitor via your Supabase dashboard under <span className="font-medium text-slate-700">Reports → Egress</span>.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safe limit guidance */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Safe operating limits for free tier</p>
                  <ul className="space-y-0.5 text-blue-700">
                    <li>File storage: Keep below <strong>700 MB</strong> (70% of 1 GB) — delete unused uploads regularly.</li>
                    <li>Database: Keep below <strong>350 MB</strong> (70% of 500 MB) — archive old contact submissions.</li>
                    <li>Egress: Keep public images optimised (WebP, &lt;200 KB each) to stay under 5 GB/month.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bucket breakdown */}
          {stats.storage.buckets.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Storage Buckets</CardTitle>
                <CardDescription>Breakdown of file storage per bucket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.storage.buckets.map((b) => {
                    const pct = parseFloat(((b.mb / stats.limits.storage_mb) * 100).toFixed(1))
                    return (
                      <div key={b.bucket}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700">{b.bucket}</span>
                          <span className="text-slate-500">{b.mb} MB ({pct}%)</span>
                        </div>
                        <UsageBar percent={pct} warning={stats.thresholds.warning} critical={stats.thresholds.critical} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table row counts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4 text-slate-500" />
                <CardTitle className="text-base">Table Row Counts</CardTitle>
              </div>
              <CardDescription>Total rows stored per database table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {stats.database.tables
                  .sort((a, b) => b.count - a.count)
                  .map((t) => (
                    <div key={t.table} className="flex items-center justify-between py-2.5">
                      <span className="text-sm font-mono text-slate-600">{t.table}</span>
                      <span className="text-sm font-semibold text-slate-800 tabular-nums">{t.count.toLocaleString()} rows</span>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-700">Total</span>
                <span className="text-sm font-bold text-slate-900">{stats.database.total_rows.toLocaleString()} rows</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
