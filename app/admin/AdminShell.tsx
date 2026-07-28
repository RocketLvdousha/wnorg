"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { name?: string | null; email?: string | null; role?: string };
}) {
  return (
    <div className="min-h-screen bg-bone-50">
      <header className="sticky top-0 z-30 border-b border-ink-700/[0.08] bg-bone-100/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/admin/share" className="cn-display text-base text-ink-700">
              卧宁 · 后台
            </Link>
            <nav className="flex items-center gap-6 text-[12px]">
              <Link href="/admin/share" className="text-ink-700 hover:text-forest-600">
                内容管理
              </Link>
              <Link
                href="/admin/home"
                className="text-charcoal/70 hover:text-forest-600"
              >
                首页
              </Link>
              <Link
                href="/admin/about"
                className="text-charcoal/70 hover:text-forest-600"
              >
                About 页
              </Link>
              <Link
                href="/share"
                target="_blank"
                className="text-charcoal/50 hover:text-ink-700"
              >
                查看前台 ↗
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-charcoal/50">
              {user?.name || user?.email} {user?.role === "admin" && "· admin"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="border border-ink-700/20 px-3 py-1.5 text-ink-700 hover:bg-bone-50"
            >
              退出
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}