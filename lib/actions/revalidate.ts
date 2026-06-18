"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateHeroSlides() {
  revalidatePath("/", "page")
}

export async function revalidateServices() {
  revalidatePath("/", "page")
}

export async function revalidateCompanyInfo() {
  revalidateTag("company-info", "pages")
  revalidatePath("/", "layout")
}

export async function revalidateAll() {
  revalidatePath("/", "layout")
}
