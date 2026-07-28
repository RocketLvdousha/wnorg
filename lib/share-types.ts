/**
 * 分享板块 payload 类型定义
 * 整个后台 + 前台共用，前台渲染只取需要的字段。
 */
export type ShareCategoryKey = "science" | "stories" | "usage";

export type LocalizedText = {
  zh: string;
  en: string;
};

export type SharePayload = {
  title_zh: string;
  title_en: string;
  summary_zh: string;
  summary_en: string;
  body_zh: string;   // Markdown / MDX
  body_en: string;
  cover: string;     // MediaAsset.path（图）或外链视频 URL
  tags: string[];
  author: string;
  date: string;      // YYYY-MM-DD
};

/** 校验 payload 是否合法（任何字段缺失都给默认值） */
export function normalizePayload(raw: unknown): SharePayload {
  const r = (raw ?? {}) as Partial<SharePayload>;
  return {
    title_zh: r.title_zh ?? "",
    title_en: r.title_en ?? "",
    summary_zh: r.summary_zh ?? "",
    summary_en: r.summary_en ?? "",
    body_zh: r.body_zh ?? "",
    body_en: r.body_en ?? "",
    cover: r.cover ?? "",
    tags: Array.isArray(r.tags) ? r.tags.filter((x) => typeof x === "string") : [],
    author: r.author ?? "",
    date: r.date ?? new Date().toISOString().slice(0, 10),
  };
}

export const SHARE_CATEGORIES: {
  key: ShareCategoryKey;
  label: string;
  desc: string;
}[] = [
  { key: "science", label: "科普类", desc: "三机制的科学原理、相关研究与日常疑问。" },
  { key: "stories", label: "用户回访视频", desc: "已购会员的真实回访：使用场景、长期感受、量化反馈。" },
  { key: "usage",   label: "产品使用及背书", desc: "产品操作演示、行业背书、合规与认证信息。" },
];

/** 默认 fallback：当某语言字段为空时取另一语言 */
export function pickLocalized(p: SharePayload, lang: "zh" | "en"): {
  title: string;
  summary: string;
  body: string;
} {
  const isEn = lang === "en";
  const title    = isEn ? (p.title_en    || p.title_zh)    : (p.title_zh    || p.title_en);
  const summary  = isEn ? (p.summary_en  || p.summary_zh)  : (p.summary_zh  || p.summary_en);
  const body     = isEn ? (p.body_en     || p.body_zh)     : (p.body_zh     || p.body_en);
  return { title, summary, body };
}