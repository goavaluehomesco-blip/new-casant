import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // No authentication required for admin routes
  // If someone visits /admin/login, redirect them straight to /admin
  if (request.nextUrl.pathname === "/admin/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next({ request })
}
