import { updateSession } from "@/lib/supabase/proxy"
import { createUnauthenticatedClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip maintenance check for admin routes, maintenance page itself, and API routes
  const isAdminRoute = pathname.startsWith("/admin")
  const isMaintenancePage = pathname === "/maintenance"
  const isApiRoute = pathname.startsWith("/api")

  if (!isAdminRoute && !isMaintenancePage && !isApiRoute) {
    try {
      const supabase = createUnauthenticatedClient()
      const { data } = await supabase
        .from("company_info")
        .select("maintenance_mode")
        .limit(1)
        .single()

      if (data?.maintenance_mode === true) {
        const url = request.nextUrl.clone()
        url.pathname = "/maintenance"
        return NextResponse.rewrite(url)
      }
    } catch {
      // If the column doesn't exist yet or any error, allow the request through
    }
  }

  // If on /maintenance but maintenance mode is off, redirect to home
  if (isMaintenancePage) {
    try {
      const supabase = createUnauthenticatedClient()
      const { data } = await supabase
        .from("company_info")
        .select("maintenance_mode")
        .limit(1)
        .single()

      if (!data?.maintenance_mode) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    } catch {
      // Allow through on error
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
