"use server"

import { revalidatePath } from "next/cache"

export async function revalidateHeroSlides() {
  revalidatePath("/", "page")
}

export async function revalidateServices() {
  revalidatePath("/", "page")
}

export async function revalidateCompanyInfo() {
  revalidatePath("/admin/settings", "page")
  revalidatePath("/", "layout")
}

export async function revalidateAll() {
  revalidatePath("/", "layout")
}
