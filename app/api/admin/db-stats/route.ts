import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Supabase free tier limits
export const FREE_TIER_LIMITS = {
  storage_mb: 1024,       // 1 GB file storage
  egress_mb: 5120,        // 5 GB egress/month
  db_size_mb: 500,        // 500 MB database size
}

// Warning thresholds (percentage of limit)
export const WARNING_THRESHOLD = 70   // warn at 70%
export const CRITICAL_THRESHOLD = 90  // critical at 90%

const TABLES = [
  "hero_slides",
  "team_members",
  "services",
  "testimonials",
  "gallery_categories",
  "gallery_projects",
  "gallery_images",
  "inventory_categories",
  "inventory_items",
  "contact_submissions",
  "instagram_posts",
  "job_postings",
  "company_info",
]

async function listBucketSize(sb: ReturnType<typeof createClient>, bucket: string, prefix = ""): Promise<number> {
  const { data, error } = await sb.storage.from(bucket).list(prefix, { limit: 1000 })
  if (error || !data) return 0
  let total = 0
  for (const item of data) {
    if (item.metadata?.size) {
      total += item.metadata.size
    } else if (!item.metadata) {
      // it's a folder
      total += await listBucketSize(sb, bucket, prefix ? `${prefix}/${item.name}` : item.name)
    }
  }
  return total
}

export async function GET() {
  try {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()

    if (!url || !key) {
      return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
    }

    const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

    // Get table row counts in parallel
    const rowCountPromises = TABLES.map(async (table) => {
      const { count, error } = await sb.from(table).select("*", { count: "exact", head: true })
      return { table, count: error ? 0 : (count ?? 0) }
    })

    // Get storage buckets
    const { data: buckets } = await sb.storage.listBuckets()

    // Get storage sizes for all buckets in parallel
    const storageSizePromises = (buckets || []).map(async (bucket) => {
      const bytes = await listBucketSize(sb, bucket.name)
      return { bucket: bucket.name, bytes, mb: parseFloat((bytes / 1024 / 1024).toFixed(2)) }
    })

    const [tableCounts, storageSizes] = await Promise.all([
      Promise.all(rowCountPromises),
      Promise.all(storageSizePromises),
    ])

    const totalStorageBytes = storageSizes.reduce((sum, b) => sum + b.bytes, 0)
    const totalStorageMb = parseFloat((totalStorageBytes / 1024 / 1024).toFixed(2))
    const totalRows = tableCounts.reduce((sum, t) => sum + t.count, 0)

    // Estimate DB size: avg ~500 bytes per row as a rough heuristic
    const estimatedDbMb = parseFloat(((totalRows * 500) / 1024 / 1024).toFixed(2))

    return NextResponse.json({
      limits: FREE_TIER_LIMITS,
      thresholds: { warning: WARNING_THRESHOLD, critical: CRITICAL_THRESHOLD },
      storage: {
        total_mb: totalStorageMb,
        limit_mb: FREE_TIER_LIMITS.storage_mb,
        percent: parseFloat(((totalStorageMb / FREE_TIER_LIMITS.storage_mb) * 100).toFixed(1)),
        buckets: storageSizes,
      },
      database: {
        total_rows: totalRows,
        estimated_mb: estimatedDbMb,
        limit_mb: FREE_TIER_LIMITS.db_size_mb,
        percent: parseFloat(((estimatedDbMb / FREE_TIER_LIMITS.db_size_mb) * 100).toFixed(1)),
        tables: tableCounts,
      },
      generated_at: new Date().toISOString(),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
