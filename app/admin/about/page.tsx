"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/app/admin/AdminShell";
import { ABOUT_SECTION_META } from "@/lib/about-types";

type Row = {
  id: string;
  displayOrder: number;
  type: string;
  title: string;
  visible: boolean;
  updatedAt: string;
};

export default function AdminAboutList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/about/sections", { cache: "no-store" });
    const data = await res.json();
    setRows(data.sections ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-charcoal/50">
        <Loader2 size={16} className="mr-2 animate-spin" /> 加载中…
      </div>
    );
  }
  if (!session) {
    if (typeof window !== "undefined") router.push("/admin/login");
    return null;
  }

  return (
    <AdminShell user={session.user}>
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="cn-display text-2xl text-ink-700">
          About 页内容
          <span className="ml-3 en-mono text-sm text-charcoal/40">
            {rows.length}
          </span>
        </h2>
        <button
          onClick={load}
          className="text-[11px] text-charcoal/50 hover:text-ink-700"
        >
          刷新
        </button>
      </div>

      <p className="mb-6 text-[12px] leading-relaxed text-charcoal/60">
        按 about.md 文档的六区块结构组织：
        首屏英雄 → 核心事实墙 → 信任证据链 → 团队真人秀 → 解决方案承诺 → 行动召唤区。
        下方按 displayOrder 排序，点击进入编辑。
      </p>

      {loading ? (
        <div className="text-charcoal/40">加载中…</div>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-ink-700/15 px-6 py-16 text-center text-[13px] text-charcoal/50">
          还没有任何区块 · 请运行 <code className="mx-1 bg-bone-50 px-1">npx prisma db seed</code> 初始化
        </div>
      ) : (
        <ul className="divide-y divide-ink-700/10 border border-ink-700/10 bg-white">
          {rows.map((r) => {
            const meta = ABOUT_SECTION_META[r.type as keyof typeof ABOUT_SECTION_META];
            return (
              <li
                key={r.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-bone-50"
              >
                <span className="en-mono shrink-0 w-10 text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
                  0{r.displayOrder}
                </span>
                <span className="en-mono shrink-0 text-[10px] uppercase tracking-[0.24em] text-forest-600">
                  [{meta?.title ?? r.type}]
                </span>
                <Link
                  href={`/admin/about/${r.id}`}
                  className="cn-display flex-1 truncate text-base text-ink-700 hover:text-forest-600"
                >
                  {r.title}
                </Link>
                <span
                  className={`shrink-0 px-2 py-0.5 text-[10px] tracking-wider ${
                    r.visible
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {r.visible ? "展示中" : "已隐藏"}
                </span>
                <span className="shrink-0 text-[11px] text-charcoal/40">
                  {new Date(r.updatedAt).toLocaleString("zh-CN")}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}