"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { footer, brand } from "@/lib/content";

const columns = [
  {
    title: "设备",
    items: [
      { label: "三合一养生仪", href: "/product" },
    ],
  },
  {
    title: "服务",
    items: [
      { label: "价格", href: "/pricing" },
      { label: "预约体验", href: "/contact" },
      { label: "隐私与数据", href: "/privacy" },
    ],
  },
  {
    title: "公司",
    items: [
      { label: "关于卧宁", href: "/about" },
      { label: "媒体合作", href: "/contact" },
      { label: "经销合作", href: "/contact" },
    ],
  },
  {
    title: "支持",
    items: [
      { label: "服务条款", href: "#" },
      { label: "免责声明", href: "#" },
      { label: "合规声明", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink-800 text-bone-100/70">
      {/* 顶部品牌带 */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16">
        <div className="mb-12 flex flex-col gap-3 border-b border-bone-100/[0.1] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="cn-display text-2xl text-bone-100">
              {brand.nameZh}
            </span>
            <span className="ml-3 en-mono text-[11px] uppercase tracking-[0.32em] text-bone-100/40">
              {brand.nameEn}
            </span>
          </div>
          <div className="en-serif text-sm italic text-bone-100/40">
            Where the bedroom meets the deep woods.
          </div>
        </div>

        {/* 4 列导航 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-bone-100/40">
                {col.title}
              </div>
              <ul className="space-y-3 text-[13px]">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="text-bone-100/70 transition-colors hover:text-bone-100"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 品牌口径 + 合规 */}
      <div className="border-t border-bone-100/[0.08]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="max-w-3xl text-[11px] leading-relaxed text-bone-100/40">
            {footer.brandNote}
            <br />
            本产品为家用睡眠辅助设备，非医疗器械；不替代医疗诊断与治疗；不构成对失眠等疾病的疗效承诺。
          </p>
        </div>
      </div>

      {/* 国家选择 + 版权（Apple 风格） */}
      <div className="border-t border-bone-100/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 text-[11px] text-bone-100/50 md:flex-row md:items-center md:justify-between">
          <button className="inline-flex items-center gap-2 transition-colors hover:text-bone-100/80">
            <span>中国大陆</span>
            <ChevronDown size={12} />
          </button>
          <div>{footer.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
