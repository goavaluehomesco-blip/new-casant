import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = "casant-media"

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function listAllFiles(folder = "") {
  const allFiles = []
  let offset = 0
  const limit = 100

  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit, offset, sortBy: { column: "name", order: "asc" } })

    if (error) { console.error(`Error listing ${folder}:`, error.message); break }
    if (!data || data.length === 0) break

    for (const item of data) {
      if (item.id === null) {
        // It's a folder — recurse
        const subPath = folder ? `${folder}/${item.name}` : item.name
        const subFiles = await listAllFiles(subPath)
        allFiles.push(...subFiles)
      } else {
        const filePath = folder ? `${folder}/${item.name}` : item.name
        allFiles.push(filePath)
      }
    }

    if (data.length < limit) break
    offset += limit
  }

  return allFiles
}

async function deleteAll() {
  console.log(`Listing all files in bucket: ${BUCKET}...`)
  const files = await listAllFiles()
  console.log(`Found ${files.length} files to delete.`)

  if (files.length === 0) {
    console.log("Bucket is already empty.")
    return
  }

  // Delete in batches of 100
  const BATCH = 100
  let deleted = 0
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH)
    const { error } = await supabase.storage.from(BUCKET).remove(batch)
    if (error) {
      console.error(`Error deleting batch ${i / BATCH + 1}:`, error.message)
    } else {
      deleted += batch.length
      console.log(`Deleted ${deleted}/${files.length} files...`)
    }
  }

  console.log(`Done. Deleted ${deleted} files from ${BUCKET}.`)
}

deleteAll()
