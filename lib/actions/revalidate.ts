"use server"

import { revalidatePath, revalidateTag } from "next/cache"

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

export async function revalidateGallery() {
  revalidateTag("gallery-projects")
  revalidateTag("gallery-categories")
  revalidatePath("/", "page")
}

export async function revalidateAll() {
  revalidatePath("/", "layout")
}
