import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Deixa a pagina de login passar
  if (pathname === "/admin/login") return NextResponse.next();

  // Verifica o cookie em todas as outras rotas /admin
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.redirect(new URL("/admin/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
