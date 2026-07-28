"use client";

/**
 * /admin/share/[id]  编辑单条
 * - 中文 / English 双 tab（共享 cover / tags / author / date）
 * - Save Draft · Publish · History · Preview
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Save,
  Send,
  History as HistoryIcon,
  Eye,
  Loader2,
} from "lucide-react";
import { AdminShell } from "@/app/admin/AdminShell";
import { MdxEditor } from "@/components/admin/MdxEditor";
import { MediaUploader } from "@/components/admin/MediaUploader";
import {
  SHARE_CATEGORIES,
  normalizePayload,
  type SharePayload,
} from "@/lib/share-types";

type EntryResp = {
  entry: {
    id: string;
    slug: string;
    category: string;
    status: string;
    publishedAt: string | null;
    drafts: { payload: string }[];
    versions: { version: number; publishedAt: string }[];
  };
};

const EMPTY: SharePayload = {
  title_zh: "",
  title_en: "",
  summary_zh: "",
  summary_en: "",
  body_zh: "",
  body_en: "",
  cover: "",
  tags: [],
  author: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function EditEntryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [entry, setEntry] = useState<EntryResp["entry"] | null>(null);
  const [payload, setPayload] = useState<SharePayload>(EMPTY);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/share/entry/${params.id}`, { cache: "no-store" });
      const data: EntryResp = await res.json();
      setEntry(data.entry);
      // API 已把 payload 从 string JSON.parse 成 object，这里直接用
      const raw = data.entry.drafts?.[0]?.payload;
      setPayload(normalizePayload(typeof raw === "string" ? JSON.parse(raw) : raw));
    } catch (e) {
      console.error("load entry failed", e);
    } finally {
      setLoading(false);
    }
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
  if (!entry) {
    return (
      <AdminShell user={session.user}>
        <div>未找到条目</div>
      </AdminShell>
    );
  }

  const cat = SHARE_CATEGORIES.find((c) => c.key === entry.category);
  // entry.drafts[0].payload 在 API 层已被 parse 成 object；payload 是我们当前的 state
  const dirty = JSON.stringify(payload) !== JSON.stringify(entry.drafts?.[0]?.payload ?? null);

  function update<K extends keyof SharePayload>(k: K, v: SharePayload[K]) {
    setPayload((p) => ({ ...p, [k]: v }));
  }

  async function saveDraft() {
    setMsg(null);
    setSaving(true);
    const res = await fetch(`/api/admin/share/entry/${params.id}/draft`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ payload }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg({ type: "ok", text: "草稿已保存" });
      load();
    } else {
      setMsg({ type: "err", text: "保存失败" });
    }
  }

  async function publish() {
    if (!payload.title_zh.trim()) {
      setMsg({ type: "err", text: "请先填写「中文标题」再发布" });
      return;
    }
    if (!payload.body_zh.trim() && !payload.body_en.trim()) {
      setMsg({ type: "err", text: "请先填写正文（中英文至少一段）再发布" });
      return;
    }
    const note = prompt("发布备注（可选）：", "") ?? "";
    setMsg(null);
    // 先保存当前草稿
    await fetch(`/api/admin/share/entry/${params.id}/draft`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ payload }),
    });
    setPublishing(true);
    const res = await fetch(`/api/admin/share/entry/${params.id}/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setPublishing(false);
    if (res.ok) {
      setMsg({ type: "ok", text: "已发布 · 前台现在可见" });
      load();
    } else {
      setMsg({ type: "err", text: "发布失败" });
    }
  }

  function addTag() {
    const v = tagInput.trim();
    if (!v) return;
    if (payload.tags.includes(v)) {
      setTagInput("");
      return;
    }
    update("tags", [...payload.tags, v]);
    setTagInput("");
  }

  function removeTag(t: string) {
    update("tags", payload.tags.filter((x) => x !== t));
  }

  const latestVersion = entry.versions[0]?.version ?? 0;

  return (
    <AdminShell user={session.user}>
      {/* 顶栏 */}
      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-ink-700/10 pb-4">
        <Link
          href="/admin/share"
          className="inline-flex items-center gap-1 text-[11px] text-charcoal/50 hover:text-ink-700"
        >
          <ArrowLeft size={12} /> 返回列表
        </Link>
        <span className="text-charcoal/30">/</span>
        <span className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
          [{cat?.label}] {entry.slug}
        </span>
        <span
          className={`px-2 py-0.5 text-[10px] ${
            entry.status === "published"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {entry.status === "published" ? `已发布 v${latestVersion}` : "草稿"}
        </span>
        {dirty && (
          <span className="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-700">未保存改动</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/admin/share/${entry.id}/history`}
            className="inline-flex items-center gap-1 border border-ink-700/20 px-3 py-1.5 text-[11px] text-ink-700 hover:bg-bone-100"
          >
            <HistoryIcon size={12} /> 历史 · v{latestVersion}
          </Link>
          {entry.status === "published" && (
            <Link
              href={`/share/${entry.category}/${entry.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 border border-ink-700/20 px-3 py-1.5 text-[11px] text-ink-700 hover:bg-bone-100"
            >
              <Eye size={12} /> 前台
            </Link>
          )}
          <button
            disabled={saving}
            onClick={saveDraft}
            className="inline-flex items-center gap-1 border border-ink-700/30 bg-bone-100 px-4 py-1.5 text-[11px] text-ink-700 hover:bg-bone-200 disabled:opacity-50"
          >
            <Save size={12} /> {saving ? "保存中…" : "保存草稿"}
          </button>
          <button
            disabled={publishing || !payload.title_zh.trim()}
            onClick={publish}
            className="inline-flex items-center gap-1 bg-ink-700 px-4 py-1.5 text-[11px] tracking-wider text-bone-100 hover:bg-ink-800 disabled:opacity-50"
            title={!payload.title_zh.trim() ? "请先填写中文标题" : ""}
          >
            <Send size={12} /> {publishing ? "发布中…" : "发布"}
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`mb-4 px-4 py-2 text-xs ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* 主体两栏 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左：主编辑区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 语言 tab */}
          <div className="flex gap-2">
            {(["zh", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 text-[11px] tracking-wider ${
                  lang === l
                    ? "bg-ink-700 text-bone-100"
                    : "border border-ink-700/20 text-ink-700 hover:bg-bone-100"
                }`}
              >
                {l === "zh" ? "中文" : "English"}
              </button>
            ))}
            <span className="ml-2 self-center text-[10px] text-charcoal/40">
              留空 = 用对方语言回退 · 中文必填
            </span>
          </div>

          {/* 标题 / 摘要 */}
          <div className="border border-ink-700/10 bg-white p-5">
            <label className="mb-4 block">
              <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
                Title · {lang === "zh" ? "中文" : "English"}
              </div>
              <input
                value={lang === "zh" ? payload.title_zh : payload.title_en}
                onChange={(e) =>
                  update(lang === "zh" ? "title_zh" : "title_en", e.target.value)
                }
                className="w-full border-b border-ink-700/20 bg-transparent py-2 cn-display text-2xl text-ink-700 outline-none focus:border-ink-700"
                placeholder={lang === "zh" ? "文章标题" : "Title"}
              />
            </label>
            <label className="block">
              <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
                Summary · 列表卡片摘要
              </div>
              <textarea
                rows={2}
                value={lang === "zh" ? payload.summary_zh : payload.summary_en}
                onChange={(e) =>
                  update(lang === "zh" ? "summary_zh" : "summary_en", e.target.value)
                }
                className="w-full border border-ink-700/15 bg-transparent px-3 py-2 text-sm leading-relaxed text-charcoal/80 outline-none focus:border-ink-700/40"
                placeholder={lang === "zh" ? "1–2 句摘要" : "1–2 sentences"}
              />
            </label>
          </div>

          {/* 正文 MDX */}
          <div>
            <div className="en-mono mb-2 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
              Body · {lang === "zh" ? "中文" : "English"} · Markdown
            </div>
            <MdxEditor
              value={lang === "zh" ? payload.body_zh : payload.body_en}
              onChange={(v) => update(lang === "zh" ? "body_zh" : "body_en", v)}
            />
          </div>
        </div>

        {/* 右：元数据 */}
        <div className="space-y-6">
          <div className="border border-ink-700/10 bg-white p-5">
            <div className="en-mono mb-3 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
              Cover · 封面图/视频
            </div>
            {payload.cover ? (
              <div className="relative">
                {/\.(mp4|webm|mov)$/i.test(payload.cover) ||
                payload.cover.includes("/videos/") ? (
                  <video
                    src={payload.cover}
                    controls
                    className="w-full border border-ink-700/10"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={payload.cover}
                    alt="cover"
                    className="w-full border border-ink-700/10"
                  />
                )}
                <button
                  onClick={() => update("cover", "")}
                  className="absolute right-2 top-2 bg-white/90 px-2 py-1 text-[10px] hover:bg-white"
                >
                  移除
                </button>
              </div>
            ) : (
              <MediaUploader
                kind="image-or-video"
                onPick={(a) => update("cover", a.path)}
              />
            )}
          </div>

          <div className="border border-ink-700/10 bg-white p-5 space-y-4">
            <label>
              <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
                Publish Date
              </div>
              <input
                type="date"
                value={payload.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
              />
            </label>
            <label>
              <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
                Author · 署名
              </div>
              <input
                value={payload.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="如：卧宁研究院"
                className="w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
              />
            </label>
            <div>
              <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
                Tags
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {payload.tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => removeTag(t)}
                    className="en-mono border border-forest-600/40 bg-forest-600/5 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-forest-600 hover:bg-red-50 hover:text-red-600"
                    title="点击移除"
                  >
                    # {t} ×
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="输入标签后回车"
                  className="flex-1 border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
                />
                <button
                  onClick={addTag}
                  className="border border-ink-700/30 px-3 py-2 text-[11px] text-ink-700 hover:bg-bone-100"
                >
                  添加
                </button>
              </div>
            </div>
          </div>

          <div className="border border-ink-700/10 bg-bone-100 p-5 text-[11px] leading-relaxed text-charcoal/60">
            <div className="cn-display mb-2 text-sm text-ink-700">字段说明</div>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>slug 一旦发布不应再改（前台 URL 永久有效）</li>
              <li>中英双语中至少填中文</li>
              <li>正文支持 Markdown · 代码块 · 表格 · 列表</li>
              <li>每次"发布"会生成新版本，可从历史回滚</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}