"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { nav } from "@/lib/content";
import { ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-bone-100/[0.08] bg-ink-800/90 text-bone-100 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* LOGO */}
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="cn-display text-base text-bone-100">卧宁睡眠</span>
          <span className="hidden text-[9px] tracking-[0.32em] text-bone-100/40 sm:inline">
            WONING
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.items.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const hasChildren =
              item.children && item.children.length > 0;

            // 带子菜单的项：hover 出下拉
            if (hasChildren) {
              return (
                <div key={item.href} className="group relative">
                  <button
                    type="button"
                    className={cn(
                      "relative flex items-center gap-1 text-[12px] tracking-wide transition-colors",
                      active
                        ? "text-bone-100"
                        : "text-bone-100/70 hover:text-bone-100"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={12}
                      strokeWidth={1.5}
                      className="opacity-60 transition-transform group-hover:rotate-180"
                    />
                    {active && (
                      <span className="absolute -bottom-2 left-1/2 h-px w-4 -translate-x-1/2 bg-gold-300" />
                    )}
                  </button>
                  {/* 下拉面板 */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[200px] border border-bone-100/10 bg-ink-800/95 py-2 shadow-xl backdrop-blur-md">
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-[11px] tracking-[0.24em] text-bone-100/40 transition-colors hover:bg-bone-100/5 hover:text-bone-100/60"
                      >
                        全部 ·
                      </Link>
                      {item.children!.map((child) => {
                        const childActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-[12px] tracking-wide transition-colors",
                              childActive
                                ? "bg-bone-100/5 text-gold-300"
                                : "text-bone-100/70 hover:bg-bone-100/5 hover:text-bone-100"
                            )}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // 普通项
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[12px] tracking-wide transition-colors",
                  active
                    ? "text-bone-100"
                    : "text-bone-100/70 hover:text-bone-100"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-2 left-1/2 h-px w-4 -translate-x-1/2 bg-gold-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 右侧 CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="border border-bone-100/30 bg-bone-100 px-3.5 py-1.5 text-[11px] tracking-wider text-ink-700 transition-all hover:bg-bone-200"
          >
            预约体验
          </Link>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          onClick={() => setOpen(!open)}
          className="text-bone-100 lg:hidden"
          aria-label="菜单"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <div className="border-t border-bone-100/[0.08] bg-ink-800 lg:hidden">
          <nav className="flex flex-col px-6 py-6">
            {nav.items.map((item) => {
              const hasChildren =
                item.children && item.children.length > 0;

              if (hasChildren) {
                return (
                  <div
                    key={item.href}
                    className="border-b border-bone-100/[0.08]"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileSubOpen(!mobileSubOpen)}
                      className="flex w-full items-center justify-between py-3 text-sm text-bone-100"
                      aria-expanded={mobileSubOpen}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        strokeWidth={1.5}
                        className={cn(
                          "transition-transform",
                          mobileSubOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {mobileSubOpen && (
                      <div className="pb-3 pl-4">
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-[12px] tracking-[0.24em] text-bone-100/40"
                        >
                          全部 ·
                        </Link>
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-[13px] text-bone-100/70"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-bone-100/[0.08] py-3 text-sm text-bone-100"
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center border border-bone-100/30 bg-bone-100 px-4 py-3 text-[12px] tracking-wider text-ink-700"
            >
              预约体验
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}