"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitContactForm(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const eventType = formData.get("eventType") as string
  const message = formData.get("message") as string

  if (!name || !email) {
    return { success: false, error: "Please fill in all required fields" }
  }

  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    phone: phone || null,
    event_type: eventType || null,
    message: message || null,
  })

  if (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error: "Failed to submit form. Please try again." }
  }

  revalidatePath("/admin")
  return { success: true }
}
