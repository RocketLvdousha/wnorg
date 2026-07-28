/**
 * 首页区块 payload 类型契约
 *
 * 区块（HomeSection）按 type 分发：
 *   product       主产品（卧宁睡眠.卫家精灵）展示 + 价格 + CTA
 *   companion     月光宝盒展示 + 价格 + CTA
 *   testimonials  客户证言列表（quote / name / tag）
 *   cta           首页底部 CTA 表单
 *
 * 设计要点：
 *  - 「视频组」是一个数组（label / caption / angle / src 四元组）
 *    src 可以是 /uploads/videos/xxx.mp4 或外链 URL
 *  - 名称、价格、文案三类纯文案字段都是单字段，由 admin 直接编辑
 *  - 页面框架（左右栏 / 上下顺序 / 价格带 / CTA 双按钮）由前端硬编码，不随 payload 变
 */

// 单个视频 / 图片引用
export interface MediaRef {
  id: string;          // 前端 key，建议用 timestamp+random
  src: string;         // 视频或图片的 URL（相对 /uploads/ 或外链）
  kind: "video" | "image";
  label: string;       // 中文标签（如「远红外」「暖光渐暗」）
  caption: string;     // 英文 caption
  angle: string;       // 角标（Mechanism 01 / Hero shot）
}

// ---------- product / companion 共享 ----------
export interface ProductShowcasePayload {
  /// 产品/伴侣名称（h3 主标），如「卧宁睡眠.卫家精灵」「月光宝盒」
  name: string;
  /// 副标 / 简介（右侧段落）
  intro: string;
  /// 价格（含货币符号），如「¥29,800」「¥4,800」
  price: string;
  /// 价格右侧的小灰字：「含税 · 一个价格」
  priceNote: string;
  /// 主按钮：跳转链接 + 文字
  primaryCta: { label: string; href: string };
  /// 次按钮（右上角箭头链接）：跳转链接 + 文字
  secondaryCta: { label: string; href: string };
  /// 视频 / 图片组（4 个槽）
  media: MediaRef[];
}

// ---------- testimonials ----------
export interface TestimonialsPayload {
  eyebrow: string;     // "FROM EARLY MEMBERS"
  title: string;       // "已经穿过这片森林的人"
  items: { quote: string; name: string; tag: string }[];
}

// ---------- cta ----------
export interface CtaPayload {
  eyebrow: string;     // "BY INVITATION"
  title: string;       // "预约一次卧室的现场体验"
  sub: string;
  primary: string;     // 主按钮文字
  secondary: string;   // 副文案（电话之类）
  note: string;        // 底部小字
  /// 表单字段
  fields: { name: string; label: string; type: string; placeholder: string }[];
}

export type HomeSectionType =
  | "product"
  | "companion"
  | "testimonials"
  | "cta";

export const HOME_SECTION_META: Record<
  HomeSectionType,
  { title: string; order: number }
> = {
  product: { title: "主产品展示", order: 1 },
  companion: { title: "月光宝盒展示", order: 2 },
  testimonials: { title: "客户证言", order: 3 },
  cta: { title: "首页底部 CTA", order: 4 },
};

export type HomeAnyPayload =
  | ProductShowcasePayload
  | TestimonialsPayload
  | CtaPayload;

export function isValidHomeSectionType(t: string): t is HomeSectionType {
  return t in HOME_SECTION_META;
}

export function parseHomePayload(
  raw: string,
  type: HomeSectionType
): HomeAnyPayload {
  try {
    return JSON.parse(raw) as HomeAnyPayload;
  } catch {
    return {} as HomeAnyPayload;
  }
}