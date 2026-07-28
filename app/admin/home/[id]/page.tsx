"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/app/admin/AdminShell";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type {
  HomeAnyPayload,
  HomeSectionType,
  ProductShowcasePayload,
  TestimonialsPayload,
  CtaPayload,
  MediaRef,
} from "@/lib/home-types";

type SectionResp = {
  section: {
    id: string;
    displayOrder: number;
    type: string;
    title: string;
    visible: boolean;
    payload: string;
  };
};

export default function EditHomeSectionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [section, setSection] = useState<SectionResp["section"] | null>(null);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(true);
  const [payload, setPayload] = useState<HomeAnyPayload>({} as HomeAnyPayload);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/home/sections/${params.id}`, {
        cache: "no-store",
      });
      const data: SectionResp = await res.json();
      setSection(data.section);
      setTitle(data.section.title);
      setVisible(data.section.visible);
      setPayload(
        typeof data.section.payload === "string"
          ? JSON.parse(data.section.payload)
          : (data.section.payload as HomeAnyPayload)
      );
    } catch (e) {
      console.error("load home section failed", e);
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
  if (!section) {
    return (
      <AdminShell user={session.user}>
        <div className="text-charcoal/50">未找到该区块</div>
      </AdminShell>
    );
  }

  async function save() {
    setMsg(null);
    setSaving(true);
    const res = await fetch(`/api/admin/home/sections/${params.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, visible, payload }),
    });
    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setMsg({ type: "err", text: data.error ?? "保存失败" });
      return;
    }
    setMsg({ type: "ok", text: "已保存" });
  }

  return (
    <AdminShell user={session.user}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[12px]">
          <Link
            href="/admin/home"
            className="flex items-center gap-1 text-charcoal/60 hover:text-ink-700"
          >
            <ArrowLeft size={14} /> 返回列表
          </Link>
          <span className="text-charcoal/30">·</span>
          <span className="en-mono text-[10px] uppercase tracking-[0.24em] text-forest-600">
            区块 0{section.displayOrder} · {section.type}
          </span>
        </div>
        <button
          disabled={saving}
          onClick={save}
          className="inline-flex items-center gap-2 bg-ink-700 px-5 py-2.5 text-[12px] tracking-wider text-bone-100 hover:bg-ink-800 disabled:opacity-50"
        >
          <Save size={14} /> 保存
        </button>
      </div>

      {msg && (
        <div
          className={`mb-4 px-3 py-2 text-[12px] ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="border border-ink-700/10 bg-bone-100 p-6">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600">
            编辑 · {section.type}
          </div>
          <PayloadEditor
            type={section.type as HomeSectionType}
            value={payload}
            onChange={setPayload}
          />
        </div>

        <div className="space-y-4">
          <div className="border border-ink-700/10 bg-bone-100 p-6">
            <div className="en-mono mb-3 text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
              元数据
            </div>
            <label className="block">
              <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
                标题（后台用）
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
              />
            </label>
            <label className="mt-4 flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="h-4 w-4 accent-forest-600"
              />
              前台展示
            </label>
            <div className="mt-4 text-[11px] text-charcoal/40">
              displayOrder = 0{section.displayOrder}（暂不允许改顺序）
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ==================== Editor dispatch ====================

function PayloadEditor({
  type,
  value,
  onChange,
}: {
  type: HomeSectionType;
  value: HomeAnyPayload;
  onChange: (v: HomeAnyPayload) => void;
}) {
  switch (type) {
    case "product":
      return <ShowcaseEditor value={value as ProductShowcasePayload} onChange={onChange} />;
    case "companion":
      return <ShowcaseEditor value={value as ProductShowcasePayload} onChange={onChange} />;
    case "testimonials":
      return <TestimonialsEditor value={value as TestimonialsPayload} onChange={onChange} />;
    case "cta":
      return <CtaEditor value={value as CtaPayload} onChange={onChange} />;
    default:
      return <div className="text-charcoal/50">未支持的区块类型：{type}</div>;
  }
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <div className="en-mono mb-1 text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputCls = "w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700";

// ---------- product / companion（共享）----------
function ShowcaseEditor({
  value,
  onChange,
}: {
  value: ProductShowcasePayload;
  onChange: (v: HomeAnyPayload) => void;
}) {
  function updateMedia(i: number, patch: Partial<MediaRef>) {
    const next = [...value.media];
    next[i] = { ...next[i], ...patch };
    onChange({ ...value, media: next });
  }
  function removeMedia(i: number) {
    onChange({ ...value, media: value.media.filter((_, idx) => idx !== i) });
  }
  function addMedia() {
    onChange({
      ...value,
      media: [
        ...value.media,
        {
          id: `m-${Date.now()}`,
          src: "",
          kind: "video",
          label: "",
          caption: "",
          angle: "",
        },
      ],
    });
  }

  return (
    <div>
      <Field label="产品/伴侣名称">
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className={inputCls}
        />
      </Field>
      <Field label="介绍（右侧段落）">
        <textarea
          rows={4}
          value={value.intro}
          onChange={(e) => onChange({ ...value, intro: e.target.value })}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="价格">
          <input
            value={value.price}
            onChange={(e) => onChange({ ...value, price: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="价格右侧说明">
          <input
            value={value.priceNote}
            onChange={(e) => onChange({ ...value, priceNote: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="主按钮文字">
          <input
            value={value.primaryCta.label}
            onChange={(e) =>
              onChange({
                ...value,
                primaryCta: { ...value.primaryCta, label: e.target.value },
              })
            }
            className={inputCls}
          />
        </Field>
        <Field label="主按钮链接">
          <input
            value={value.primaryCta.href}
            onChange={(e) =>
              onChange({
                ...value,
                primaryCta: { ...value.primaryCta, href: e.target.value },
              })
            }
            className={inputCls}
          />
        </Field>
        <Field label="副按钮文字">
          <input
            value={value.secondaryCta.label}
            onChange={(e) =>
              onChange({
                ...value,
                secondaryCta: { ...value.secondaryCta, label: e.target.value },
              })
            }
            className={inputCls}
          />
        </Field>
        <Field label="副按钮链接">
          <input
            value={value.secondaryCta.href}
            onChange={(e) =>
              onChange({
                ...value,
                secondaryCta: { ...value.secondaryCta, href: e.target.value },
              })
            }
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
          视频 / 图片组（最多 4 个）
        </div>
        <button
          type="button"
          onClick={addMedia}
          className="inline-flex items-center gap-1 text-[11px] text-forest-600 hover:text-forest-700"
        >
          <Plus size={12} /> 新增媒体
        </button>
      </div>

      {value.media.map((m, i) => (
        <div key={m.id} className="mb-3 border border-ink-700/10 bg-white p-3">
          <div className="grid grid-cols-3 gap-2">
            <input
              value={m.label}
              placeholder="中文标签"
              onChange={(e) => updateMedia(i, { label: e.target.value })}
              className="border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <input
              value={m.caption}
              placeholder="English caption"
              onChange={(e) => updateMedia(i, { caption: e.target.value })}
              className="border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <input
              value={m.angle}
              placeholder="角标 (Mechanism 01)"
              onChange={(e) => updateMedia(i, { angle: e.target.value })}
              className="border border-ink-700/10 px-2 py-1.5 text-sm"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <select
              value={m.kind}
              onChange={(e) => updateMedia(i, { kind: e.target.value as "video" | "image" })}
              className="border border-ink-700/10 px-2 py-1.5 text-sm"
            >
              <option value="video">视频</option>
              <option value="image">图片</option>
            </select>
            <input
              value={m.src}
              placeholder="/uploads/videos/xxx.mp4 或 https://..."
              onChange={(e) => updateMedia(i, { src: e.target.value })}
              className="flex-1 border border-ink-700/10 px-2 py-1.5 text-[11px]"
            />
            <button
              type="button"
              onClick={() => removeMedia(i)}
              className="p-1.5 text-charcoal/40 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="mt-2">
            <MediaUploader
              kind="image-or-video"
              onPick={(asset) =>
                updateMedia(i, {
                  src: asset.path,
                  kind: asset.kind,
                })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- testimonials ----------
function TestimonialsEditor({
  value,
  onChange,
}: {
  value: TestimonialsPayload;
  onChange: (v: HomeAnyPayload) => void;
}) {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Eyebrow">
          <input
            value={value.eyebrow}
            onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="标题">
          <input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
          证言条目
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              items: [...value.items, { quote: "", name: "", tag: "" }],
            })
          }
          className="inline-flex items-center gap-1 text-[11px] text-forest-600 hover:text-forest-700"
        >
          <Plus size={12} /> 新增证言
        </button>
      </div>

      {value.items.map((it, i) => (
        <div key={i} className="mb-3 border border-ink-700/10 bg-white p-3">
          <textarea
            rows={2}
            value={it.quote}
            placeholder="引语"
            onChange={(e) => {
              const next = [...value.items];
              next[i] = { ...next[i], quote: e.target.value };
              onChange({ ...value, items: next });
            }}
            className="w-full border border-ink-700/10 px-2 py-1.5 text-sm"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              value={it.name}
              placeholder="姓名"
              onChange={(e) => {
                const next = [...value.items];
                next[i] = { ...next[i], name: e.target.value };
                onChange({ ...value, items: next });
              }}
              className="w-1/3 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <input
              value={it.tag}
              placeholder="职位 · 城市"
              onChange={(e) => {
                const next = [...value.items];
                next[i] = { ...next[i], tag: e.target.value };
                onChange({ ...value, items: next });
              }}
              className="flex-1 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  items: value.items.filter((_, idx) => idx !== i),
                })
              }
              className="p-1.5 text-charcoal/40 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- cta ----------
function CtaEditor({
  value,
  onChange,
}: {
  value: CtaPayload;
  onChange: (v: HomeAnyPayload) => void;
}) {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Eyebrow">
          <input
            value={value.eyebrow}
            onChange={(e) => onChange({ ...value, eyebrow: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="主按钮文字">
          <input
            value={value.primary}
            onChange={(e) => onChange({ ...value, primary: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="标题">
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className={inputCls}
        />
      </Field>

      <Field label="副标">
        <textarea
          rows={2}
          value={value.sub}
          onChange={(e) => onChange({ ...value, sub: e.target.value })}
          className={inputCls}
        />
      </Field>

      <Field label="电话/副文案">
        <input
          value={value.secondary}
          onChange={(e) => onChange({ ...value, secondary: e.target.value })}
          className={inputCls}
        />
      </Field>

      <Field label="底部小字">
        <textarea
          rows={2}
          value={value.note}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
          className={inputCls}
        />
      </Field>

      <div className="mb-2 mt-4 flex items-center justify-between">
        <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
          表单字段
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              fields: [
                ...value.fields,
                { name: "", label: "", type: "text", placeholder: "" },
              ],
            })
          }
          className="inline-flex items-center gap-1 text-[11px] text-forest-600 hover:text-forest-700"
        >
          <Plus size={12} /> 新增字段
        </button>
      </div>

      {value.fields.map((f, i) => (
        <div key={i} className="mb-3 grid grid-cols-12 items-center gap-2 border border-ink-700/10 bg-white p-3">
          <input
            value={f.name}
            placeholder="name"
            onChange={(e) => {
              const next = [...value.fields];
              next[i] = { ...next[i], name: e.target.value };
              onChange({ ...value, fields: next });
            }}
            className="col-span-2 border border-ink-700/10 px-2 py-1.5 text-[11px]"
          />
          <input
            value={f.label}
            placeholder="label"
            onChange={(e) => {
              const next = [...value.fields];
              next[i] = { ...next[i], label: e.target.value };
              onChange({ ...value, fields: next });
            }}
            className="col-span-2 border border-ink-700/10 px-2 py-1.5 text-sm"
          />
          <select
            value={f.type}
            onChange={(e) => {
              const next = [...value.fields];
              next[i] = { ...next[i], type: e.target.value };
              onChange({ ...value, fields: next });
            }}
            className="col-span-2 border border-ink-700/10 px-2 py-1.5 text-sm"
          >
            <option value="text">text</option>
            <option value="tel">tel</option>
            <option value="email">email</option>
          </select>
          <input
            value={f.placeholder}
            placeholder="placeholder"
            onChange={(e) => {
              const next = [...value.fields];
              next[i] = { ...next[i], placeholder: e.target.value };
              onChange({ ...value, fields: next });
            }}
            className="col-span-5 border border-ink-700/10 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() =>
              onChange({
                ...value,
                fields: value.fields.filter((_, idx) => idx !== i),
              })
            }
            className="col-span-1 p-1.5 text-charcoal/40 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}