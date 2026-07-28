/**
 * /admin/share  内容列表
 * - 顶部：新建条目表单（category + slug）
 * - 主区：所有条目卡（草稿 / 已发布 两 tab），按分类分组
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { AdminShell } from "@/app/admin/AdminShell";
import { SHARE_CATEGORIES, type ShareCategoryKey } from "@/lib/share-types";

type EntryRow = {
  id: string;
  slug: string;
  category: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  drafts: { updatedAt: string }[];
  versions: { version: number; publishedAt: string }[];
};

const STATUS_LABEL: Record<string, { zh: string; tone: string }> = {
  draft: { zh: "草稿", tone: "bg-amber-100 text-amber-800" },
  published: { zh: "已发布", tone: "bg-emerald-100 text-emerald-800" },
  archived: { zh: "已归档", tone: "bg-stone-200 text-stone-600" },
};

export default function AdminShareList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [loading, setLoading] = useState(true);

  // 新建表单
  const [newCat, setNewCat] = useState<ShareCategoryKey>("science");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/share/list", { cache: "no-store" });
    const data = await res.json();
    setEntries(data.entries ?? []);
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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateErr(null);
    setCreating(true);
    const res = await fetch("/api/admin/share/entry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category: newCat, slug: newSlug.trim() }),
    });
    setCreating(false);
    const data = await res.json();
    if (!res.ok) {
      setCreateErr(data.error ?? "创建失败");
      return;
    }
    setNewSlug("");
    router.push(`/admin/share/${data.entry.id}`);
  }

  async function onDelete(id: string) {
    if (!confirm("确认删除？此操作会清除该条目的所有草稿和历史版本。")) return;
    await fetch(`/api/admin/share/entry/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell user={session.user}>
      {/* 新建 */}
      <section className="mb-8 border border-ink-700/10 bg-bone-100 p-6">
        <div className="en-mono mb-3 text-[10px] uppercase tracking-[0.32em] text-forest-600">
          New Entry
        </div>
        <form
          onSubmit={onCreate}
          className="flex flex-wrap items-end gap-3"
        >
          <label className="flex-1 min-w-[180px]">
            <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
              Category
            </div>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value as ShareCategoryKey)}
              className="w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
            >
              {SHARE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-[2] min-w-[240px]">
            <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
              Slug · URL 段
            </div>
            <input
              required
              pattern="[a-z0-9\-]+"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="my-new-entry"
              className="w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
            />
          </label>
          <button
            disabled={creating || !newSlug}
            type="submit"
            className="inline-flex items-center gap-2 bg-ink-700 px-5 py-2.5 text-[12px] tracking-wider text-bone-100 hover:bg-ink-800 disabled:opacity-50"
          >
            <Plus size={14} /> 新建草稿
          </button>
        </form>
        {createErr && <div className="mt-3 text-xs text-red-600">{createErr}</div>}
        <div className="mt-3 text-[11px] text-charcoal/50">
          slug 仅允许小写字母、数字、连字符。创建后只能在前台 URL 里看到，slug 一旦发布不应再改。
        </div>
      </section>

      {/* 列表 */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="cn-display text-2xl text-ink-700">
            全部内容
            <span className="ml-3 en-mono text-sm text-charcoal/40">
              {entries.length}
            </span>
          </h2>
          <button
            onClick={load}
            className="text-[11px] text-charcoal/50 hover:text-ink-700"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="text-charcoal/40">加载中…</div>
        ) : entries.length === 0 ? (
          <div className="border border-dashed border-ink-700/15 px-6 py-16 text-center text-[13px] text-charcoal/50">
            还没有任何条目 · 用上方表单创建第一条
          </div>
        ) : (
          <ul className="divide-y divide-ink-700/10 border border-ink-700/10 bg-white">
            {entries.map((e) => {
              const cat = SHARE_CATEGORIES.find((c) => c.key === e.category);
              const st = STATUS_LABEL[e.status] ?? STATUS_LABEL.draft;
              const latestVersion = e.versions[0]?.version ?? 0;
              return (
                <li
                  key={e.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-bone-50"
                >
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] tracking-wider ${st.tone}`}
                  >
                    {st.zh}
                  </span>
                  <span className="en-mono shrink-0 text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
                    [{cat?.label ?? e.category}]
                  </span>
                  <Link
                    href={`/admin/share/${e.id}`}
                    className="cn-display flex-1 truncate text-base text-ink-700 hover:text-forest-600"
                  >
                    {e.slug}
                  </Link>
                  <span className="en-mono shrink-0 text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
                    v{latestVersion}
                  </span>
                  <span className="shrink-0 text-[11px] text-charcoal/40">
                    {new Date(e.updatedAt).toLocaleString("zh-CN")}
                  </span>
                  <button
                    onClick={() => onDelete(e.id)}
                    title="删除"
                    className="shrink-0 p-1 text-charcoal/30 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}