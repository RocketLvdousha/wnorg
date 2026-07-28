/**
 * 中间件：拦截 /admin/* 与 /api/admin/*
 * 未登录重定向到 /admin/login（页面）
 * /api/admin/* 返回 401 JSON
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 仅拦截 admin 路由
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = await getToken({ req, secret: SECRET });

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};