"use client";

/**
 * /admin/share/[id]/history
 * 版本时间线 + 一键回滚（把任一 version 拷贝回 draft，再 publish 才生效）
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { AdminShell } from "@/app/admin/AdminShell";
import { normalizePayload, type SharePayload } from "@/lib/share-types";

type VersionRow = {
  id: string;
  version: number;
  publishedAt: string;
  note: string | null;
  publishedBy: { name?: string | null; email: string };
  payload: string;
};

export default function HistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [entry, setEntry] = useState<{ slug: string; category: string } | null>(null);
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/share/entry/${params.id}`, { cache: "no-store" });
    const data = await res.json();
    setEntry({ slug: data.entry.slug, category: data.entry.category });
    setVersions(data.entry.versions);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, params.id]);

  if (status === "loading" || loading) {
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

  async function rollback(version: number) {
    if (!confirm(`把 v${version} 的内容拷贝回当前草稿？（需要再点"发布"才生效到前台）`))
      return;
    setRolling(version);
    await fetch(`/api/admin/share/entry/${params.id}/rollback`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ version }),
    });
    setRolling(null);
    router.push(`/admin/share/${params.id}`);
  }

  return (
    <AdminShell user={session.user}>
      <div className="mb-6 flex items-center gap-3 border-b border-ink-700/10 pb-4">
        <Link
          href={`/admin/share/${params.id}`}
          className="inline-flex items-center gap-1 text-[11px] text-charcoal/50 hover:text-ink-700"
        >
          <ArrowLeft size={12} /> 返回编辑
        </Link>
        <span className="text-charcoal/30">/</span>
        <span className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
          历史版本 · {entry?.slug}
        </span>
      </div>

      <div className="en-mono mb-3 text-[10px] uppercase tracking-[0.32em] text-forest-600">
        Timeline · {versions.length} versions
      </div>

      {versions.length === 0 ? (
        <div className="border border-dashed border-ink-700/15 px-6 py-16 text-center text-[13px] text-charcoal/50">
          还没有任何已发布版本 · 在编辑页点击"发布"创建第一个版本
        </div>
      ) : (
        <ol className="space-y-3">
          {versions.map((v) => {
            const p = normalizePayload(
              typeof v.payload === "string" ? JSON.parse(v.payload) : v.payload
            );
            return (
              <li
                key={v.id}
                className="border border-ink-700/10 bg-white p-5"
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="en-serif text-2xl text-ink-700">v{v.version}</span>
                    <span className="text-[11px] text-charcoal/50">
                      {new Date(v.publishedAt).toLocaleString("zh-CN")}
                    </span>
                    <span className="text-[11px] text-charcoal/40">
                      by {v.publishedBy.name || v.publishedBy.email}
                    </span>
                  </div>
                  <button
                    disabled={rolling !== null}
                    onClick={() => rollback(v.version)}
                    className="inline-flex items-center gap-1 border border-ink-700/20 px-3 py-1.5 text-[11px] text-ink-700 hover:bg-bone-100 disabled:opacity-50"
                  >
                    <RotateCcw size={12} />
                    {rolling === v.version ? "回滚中…" : "回滚到此版本"}
                  </button>
                </div>
                {v.note && (
                  <div className="mb-3 text-[11px] text-charcoal/50 italic">
                    "{v.note}"
                  </div>
                )}
                <div className="border-l-2 border-ink-700/10 pl-4 text-[13px] text-charcoal/80">
                  <div className="cn-display text-base text-ink-700">{p.title_zh}</div>
                  {p.title_en && (
                    <div className="text-xs text-charcoal/50">{p.title_en}</div>
                  )}
                  <div className="mt-2 line-clamp-2 text-charcoal/60">
                    {p.summary_zh}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </AdminShell>
  );
}