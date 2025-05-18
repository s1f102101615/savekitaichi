import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// モックAPIへのリクエストをリダイレクトするミドルウェア
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // /api/employees, /api/machines, /api/sessions などのリクエストを
  // /api/mock にリダイレクト
  if (url.pathname.startsWith("/api/")) {
    url.pathname = "/api/mock"
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: "/api/:path*",
}
