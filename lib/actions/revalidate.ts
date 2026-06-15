"use server"

import { revalidatePath } from "next/cache"

export async function revalidateHeroSlides() {
  revalidatePath("/", "page")
}

export async function revalidateServices() {
  revalidatePath("/", "page")
}

export async function revalidateAll() {
  revalidatePath("/", "layout")
}
