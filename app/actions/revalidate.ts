'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateAllCache() {
  // Revalidate all pages that display dynamic content
  revalidatePath('/', 'page')
  revalidatePath('/weddings', 'page')
  revalidatePath('/corporate', 'page')
  revalidatePath('/portfolio', 'page')
  revalidatePath('/inventory', 'page')
  revalidatePath('/about', 'page')
  revalidatePath('/contact', 'page')
  revalidatePath('/careers', 'page')

  return { success: true, message: 'Cache revalidated successfully' }
}

export async function revalidateSingleTag(tag: string) {
  revalidatePath('/', 'layout')
  return { success: true, message: `Tag '${tag}' revalidated` }
}
