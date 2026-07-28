"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/app/admin/AdminShell";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type {
  AboutAnyPayload,
  AboutCtaPayload,
  AboutFactsPayload,
  AboutHeroPayload,
  AboutPromisePayload,
  AboutTeamPayload,
  AboutTrustPayload,
  AboutSectionType,
} from "@/lib/about-types";

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

export default function EditAboutSectionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [section, setSection] = useState<SectionResp["section"] | null>(null);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(true);
  const [payload, setPayload] = useState<AboutAnyPayload>({} as AboutAnyPayload);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/about/sections/${params.id}`, {
        cache: "no-store",
      });
      const data: SectionResp = await res.json();
      setSection(data.section);
      setTitle(data.section.title);
      setVisible(data.section.visible);
      setPayload(
        typeof data.section.payload === "string"
          ? JSON.parse(data.section.payload)
          : (data.section.payload as AboutAnyPayload)
      );
    } catch (e) {
      console.error("load about section failed", e);
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
    const res = await fetch(`/api/admin/about/sections/${params.id}`, {
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
            href="/admin/about"
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

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* 主编辑区：按 type 分发 */}
        <div className="border border-ink-700/10 bg-bone-100 p-6">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600">
            编辑 · {section.type}
          </div>
          <PayloadEditor
            type={section.type as AboutSectionType}
            value={payload}
            onChange={setPayload}
          />
        </div>

        {/* 侧栏：元数据 */}
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

// ==================== Payload Editor（按 type 分发）====================

function PayloadEditor({
  type,
  value,
  onChange,
}: {
  type: AboutSectionType;
  value: AboutAnyPayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  switch (type) {
    case "hero":
      return <HeroEditor value={value as AboutHeroPayload} onChange={onChange} />;
    case "facts":
      return <FactsEditor value={value as AboutFactsPayload} onChange={onChange} />;
    case "trust":
      return <TrustEditor value={value as AboutTrustPayload} onChange={onChange} />;
    case "team":
      return <TeamEditor value={value as AboutTeamPayload} onChange={onChange} />;
    case "promise":
      return <PromiseEditor value={value as AboutPromisePayload} onChange={onChange} />;
    case "cta":
      return <CtaEditor value={value as AboutCtaPayload} onChange={onChange} />;
    default:
      return (
        <div className="text-charcoal/50">未支持的区块类型：{type}</div>
      );
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

function inputCls() {
  return "w-full border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700";
}

// ---------- hero ----------
function HeroEditor({
  value,
  onChange,
}: {
  value: AboutHeroPayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  return (
    <div>
      <Field label="主标题">
        <textarea
          rows={2}
          value={value.headline}
          onChange={(e) => onChange({ ...value, headline: e.target.value })}
          className={inputCls()}
        />
      </Field>
      <Field label="副标题">
        <textarea
          rows={2}
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
          className={inputCls()}
        />
      </Field>

      <div className="mt-4 mb-2 flex items-center justify-between">
        <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
          3 个服务承诺浮窗
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              highlights: [...value.highlights, { k: "", v: "" }],
            })
          }
          className="inline-flex items-center gap-1 text-[11px] text-forest-600 hover:text-forest-700"
        >
          <Plus size={12} /> 新增
        </button>
      </div>
      {value.highlights.map((h, i) => (
        <div
          key={i}
          className="mb-3 flex items-start gap-2 border border-ink-700/10 bg-white p-3"
        >
          <input
            value={h.k}
            placeholder="标题"
            onChange={(e) => {
              const next = [...value.highlights];
              next[i] = { ...next[i], k: e.target.value };
              onChange({ ...value, highlights: next });
            }}
            className="w-1/3 border border-ink-700/10 px-2 py-1.5 text-sm"
          />
          <input
            value={h.v}
            placeholder="描述"
            onChange={(e) => {
              const next = [...value.highlights];
              next[i] = { ...next[i], v: e.target.value };
              onChange({ ...value, highlights: next });
            }}
            className="flex-1 border border-ink-700/10 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              const next = value.highlights.filter((_, idx) => idx !== i);
              onChange({ ...value, highlights: next });
            }}
            className="p-1.5 text-charcoal/40 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------- facts ----------
function FactsEditor({
  value,
  onChange,
}: {
  value: AboutFactsPayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  return (
    <div>
      <Field label="总部位置">
        <input
          value={value.hq}
          onChange={(e) => onChange({ ...value, hq: e.target.value })}
          className={inputCls()}
        />
      </Field>
      <Field label="核心业务">
        <input
          value={value.coreBusiness}
          onChange={(e) => onChange({ ...value, coreBusiness: e.target.value })}
          className={inputCls()}
        />
      </Field>
      <Field label="专注领域（用 / 分隔）">
        <input
          value={value.focusAreas.join(" / ")}
          onChange={(e) =>
            onChange({
              ...value,
              focusAreas: e.target.value.split("/").map((s) => s.trim()).filter(Boolean),
            })
          }
          className={inputCls()}
        />
      </Field>
      <Field label="公司状态">
        <textarea
          rows={2}
          value={value.companyStatus}
          onChange={(e) => onChange({ ...value, companyStatus: e.target.value })}
          className={inputCls()}
        />
      </Field>
      <Field label="统一社会信用代码（可选）">
        <input
          value={value.creditCode ?? ""}
          onChange={(e) => onChange({ ...value, creditCode: e.target.value })}
          className={inputCls()}
        />
      </Field>
    </div>
  );
}

// ---------- trust ----------
function TrustEditor({
  value,
  onChange,
}: {
  value: AboutTrustPayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
          团队背景时间轴
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              timeline: [...value.timeline, { year: "", title: "", body: "" }],
            })
          }
          className="inline-flex items-center gap-1 text-[11px] text-forest-600 hover:text-forest-700"
        >
          <Plus size={12} /> 新增节点
        </button>
      </div>
      {value.timeline.map((n, i) => (
        <div
          key={i}
          className="mb-3 border border-ink-700/10 bg-white p-3"
        >
          <div className="flex items-start gap-2">
            <input
              value={n.year}
              placeholder="节点标签（如：团队背景）"
              onChange={(e) => {
                const next = [...value.timeline];
                next[i] = { ...next[i], year: e.target.value };
                onChange({ ...value, timeline: next });
              }}
              className="w-1/3 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <input
              value={n.title}
              placeholder="节点标题"
              onChange={(e) => {
                const next = [...value.timeline];
                next[i] = { ...next[i], title: e.target.value };
                onChange({ ...value, timeline: next });
              }}
              className="flex-1 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  timeline: value.timeline.filter((_, idx) => idx !== i),
                })
              }
              className="p-1.5 text-charcoal/40 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            rows={2}
            value={n.body}
            placeholder="节点说明"
            onChange={(e) => {
              const next = [...value.timeline];
              next[i] = { ...next[i], body: e.target.value };
              onChange({ ...value, timeline: next });
            }}
            className="mt-2 w-full border border-ink-700/10 px-2 py-1.5 text-sm"
          />
        </div>
      ))}

      <div className="mt-6 mb-2 en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
        前置信任 · 三列卡片
      </div>
      {value.pillars.map((p, i) => (
        <div key={i} className="mb-3 border border-ink-700/10 bg-white p-3">
          <div className="flex items-center gap-2">
            <select
              value={p.k}
              onChange={(e) => {
                const next = [...value.pillars];
                next[i] = {
                  ...next[i],
                  k: e.target.value as AboutTrustPayload["pillars"][number]["k"],
                };
                onChange({ ...value, pillars: next });
              }}
              className="border border-ink-700/10 px-2 py-1.5 text-sm"
            >
              <option value="qualification">资质备案</option>
              <option value="ecosystem">合作生态</option>
              <option value="credential">专业背书</option>
            </select>
            <input
              value={p.title}
              placeholder="列标题"
              onChange={(e) => {
                const next = [...value.pillars];
                next[i] = { ...next[i], title: e.target.value };
                onChange({ ...value, pillars: next });
              }}
              className="flex-1 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
          </div>
          <textarea
            rows={3}
            value={p.items.join("\n")}
            placeholder="一行一条"
            onChange={(e) => {
              const next = [...value.pillars];
              next[i] = {
                ...next[i],
                items: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              };
              onChange({ ...value, pillars: next });
            }}
            className="mt-2 w-full border border-ink-700/10 px-2 py-1.5 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// ---------- team ----------
function TeamEditor({
  value,
  onChange,
}: {
  value: AboutTeamPayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  return (
    <div>
      <Field label="区块 intro">
        <textarea
          rows={2}
          value={value.intro}
          onChange={(e) => onChange({ ...value, intro: e.target.value })}
          className={inputCls()}
        />
      </Field>

      <div className="mb-2 flex items-center justify-between">
        <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/50">
          团队成员
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              members: [
                ...value.members,
                {
                  id: `member-${Date.now()}`,
                  name: "",
                  role: "",
                  bio: "",
                  photo: "",
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 text-[11px] text-forest-600 hover:text-forest-700"
        >
          <Plus size={12} /> 新增成员
        </button>
      </div>
      {value.members.map((m, i) => (
        <div key={i} className="mb-3 border border-ink-700/10 bg-white p-3">
          <div className="flex items-start gap-2">
            <input
              value={m.name}
              placeholder="姓名"
              onChange={(e) => {
                const next = [...value.members];
                next[i] = { ...next[i], name: e.target.value };
                onChange({ ...value, members: next });
              }}
              className="w-1/3 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <input
              value={m.role}
              placeholder="职位"
              onChange={(e) => {
                const next = [...value.members];
                next[i] = { ...next[i], role: e.target.value };
                onChange({ ...value, members: next });
              }}
              className="flex-1 border border-ink-700/10 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  members: value.members.filter((_, idx) => idx !== i),
                })
              }
              className="p-1.5 text-charcoal/40 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <textarea
            rows={2}
            value={m.bio}
            placeholder="一句话履历"
            onChange={(e) => {
              const next = [...value.members];
              next[i] = { ...next[i], bio: e.target.value };
              onChange({ ...value, members: next });
            }}
            className="mt-2 w-full border border-ink-700/10 px-2 py-1.5 text-sm"
          />
          <input
            value={m.photo ?? ""}
            placeholder="照片 URL（可选）"
            onChange={(e) => {
              const next = [...value.members];
              next[i] = { ...next[i], photo: e.target.value };
              onChange({ ...value, members: next });
            }}
            className="mt-2 w-full border border-ink-700/10 px-2 py-1.5 text-[11px]"
          />
          <div className="mt-2">
            <MediaUploader
              kind="image"
              onPick={(asset) => {
                const next = [...value.members];
                next[i] = { ...next[i], photo: asset.path };
                onChange({ ...value, members: next });
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- promise ----------
function PromiseEditor({
  value,
  onChange,
}: {
  value: AboutPromisePayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  return (
    <div>
      <Field label="承诺主语句">
        <textarea
          rows={3}
          value={value.statement}
          onChange={(e) => onChange({ ...value, statement: e.target.value })}
          className={inputCls()}
        />
      </Field>
      <Field label="附加可量化承诺（一行一条，可选）">
        <textarea
          rows={4}
          value={(value.bullets ?? []).join("\n")}
          onChange={(e) =>
            onChange({
              ...value,
              bullets: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
            })
          }
          className={inputCls()}
        />
      </Field>
    </div>
  );
}

// ---------- cta ----------
function CtaEditor({
  value,
  onChange,
}: {
  value: AboutCtaPayload;
  onChange: (v: AboutAnyPayload) => void;
}) {
  return (
    <div>
      <Field label="主按钮 · 文字">
        <input
          value={value.primary.label}
          onChange={(e) =>
            onChange({ ...value, primary: { ...value.primary, label: e.target.value } })
          }
          className={inputCls()}
        />
      </Field>
      <Field label="主按钮 · 链接">
        <input
          value={value.primary.href}
          onChange={(e) =>
            onChange({ ...value, primary: { ...value.primary, href: e.target.value } })
          }
          className={inputCls()}
        />
      </Field>
      <Field label="副按钮 · 文字">
        <input
          value={value.secondary.label}
          onChange={(e) =>
            onChange({
              ...value,
              secondary: { ...value.secondary, label: e.target.value },
            })
          }
          className={inputCls()}
        />
      </Field>
      <Field label="副按钮 · 链接">
        <input
          value={value.secondary.href}
          onChange={(e) =>
            onChange({
              ...value,
              secondary: { ...value.secondary, href: e.target.value },
            })
          }
          className={inputCls()}
        />
      </Field>
      <Field label="底部备注（可选）">
        <textarea
          rows={2}
          value={value.note ?? ""}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
          className={inputCls()}
        />
      </Field>
    </div>
  );
}