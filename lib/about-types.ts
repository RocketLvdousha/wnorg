/**
 * About 页六区块的 payload 类型契约
 *
 * 区块（AboutSection）按 type 分发：
 *   hero     首屏英雄区
 *   facts    核心事实墙
 *   trust    信任证据链（团队背景时间轴 + 前置信任三列卡片）
 *   team     团队真人秀
 *   promise  解决方案承诺
 *   cta      行动召唤区
 *
 * Admin 编辑时按 type 渲染对应表单；前端按 type 渲染对应展示组件。
 * 任何对结构的扩展都走「向后兼容的 optional 字段」原则。
 */

// ---------- hero ----------
export interface AboutHeroPayload {
  /** 品牌名 + 副词组，例如：「卧宁睡眠科技，专注睡眠健康解决方案的销售与服务」 */
  headline: string;
  /** 副标题：聚焦目标客户 */
  subtitle: string;
  /** 「替代数据浮窗」：3 个服务承诺或差异化优势（不放 0 客户这种反向数据） */
  highlights: { k: string; v: string }[];
}

// ---------- facts ----------
export interface AboutFactsPayload {
  /** 例如：「中国·深圳」 */
  hq: string;
  /** 「睡眠健康管理解决方案的销售与服务」 */
  coreBusiness: string;
  /** 「养老机构 / 酒店 / 企业健康福利」选 1-2 个起步赛道 */
  focusAreas: string[];
  /** 「国家企业信用信息公示系统」可查的统一社会信用代码等公司状态描述 */
  companyStatus: string;
  /** 可选：统一社会信用代码、注册号等可核验字段 */
  creditCode?: string;
}

// ---------- trust ----------
export interface AboutTrustPayload {
  /** 上半部分：团队背景时间轴（节点） */
  timeline: { year: string; title: string; body: string }[];
  /** 下半部分：前置信任 3 列卡片 */
  pillars: {
    k: "qualification" | "ecosystem" | "credential";
    title: string;
    items: string[];
  }[];
}

// ---------- team ----------
export interface AboutTeamPayload {
  intro: string;
  members: {
    id: string;
    name: string;
    role: string;
    bio: string;
    photo?: string; // 可选：未上传则用首字母占位
  }[];
}

// ---------- promise ----------
export interface AboutPromisePayload {
  /** 一句话服务承诺，替代空泛愿景 */
  statement: string;
  /** 可选：附加几条可量化承诺 */
  bullets?: string[];
}

// ---------- cta ----------
export interface AboutCtaPayload {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  note?: string;
}

export type AboutSectionType =
  | "hero"
  | "facts"
  | "trust"
  | "team"
  | "promise"
  | "cta";

export const ABOUT_SECTION_META: Record<
  AboutSectionType,
  { title: string; order: number }
> = {
  hero: { title: "首屏英雄区", order: 1 },
  facts: { title: "核心事实墙", order: 2 },
  trust: { title: "信任证据链", order: 3 },
  team: { title: "团队真人秀", order: 4 },
  promise: { title: "解决方案承诺", order: 5 },
  cta: { title: "行动召唤区", order: 6 },
};

export type AboutAnyPayload =
  | AboutHeroPayload
  | AboutFactsPayload
  | AboutTrustPayload
  | AboutTeamPayload
  | AboutPromisePayload
  | AboutCtaPayload;

export function isValidSectionType(t: string): t is AboutSectionType {
  return t in ABOUT_SECTION_META;
}

/** 解析 DB payload（string）→ 结构化对象；失败时回退到安全的默认空对象 */
export function parseSectionPayload(
  raw: string,
  type: AboutSectionType
): AboutAnyPayload {
  try {
    return JSON.parse(raw) as AboutAnyPayload;
  } catch {
    return {} as AboutAnyPayload;
  }
}