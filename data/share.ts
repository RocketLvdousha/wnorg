/**
 * 产品分享 · 内容数据
 *
 * 「后台管理」入口（最小可行版本）
 * --------------------------------
 *   新增一条内容：只需在下方 `shareEntries` 数组里 push 一个对象，
 *   不需要改任何页面文件。
 *
 *   后续如需更「后台化」，可在该文件之外：
 *     - 把本文件改成 JSON（`data/share.json`），
 *     - 或接入 TinaCMS / Decap CMS / Sanity / Strapi，
 *     - 或接数据库（Prisma + 自建 admin）。
 *   当前 TypeScript 结构是这些迁移的共同上游 schema。
 *
 * 字段说明
 * --------------------------------
 *   slug      URL 段，全站唯一，必填
 *   category  所属分类 key（与 shareCategories.key 对应）
 *   title     标题
 *   summary   列表卡片摘要（1–2 句）
 *   body      详情页正文（支持 \n\n 段落分隔的纯文本，后续可升级为 MDX）
 *   cover     封面图 / 视频 src（可选）
 *   date      发布日期 YYYY-MM-DD
 *   author    署名（可选）
 *   tags      标签（可选）
 */

export type ShareCategoryKey = "science" | "stories" | "usage";

export type ShareCategory = {
  key: ShareCategoryKey;
  href: string; // 分类页路径
  label: string;
  desc: string;
};

export const shareCategories: ShareCategory[] = [
  {
    key: "science",
    href: "/share/science",
    label: "科普类",
    desc: "三机制的科学原理、相关研究与日常疑问。",
  },
  {
    key: "stories",
    href: "/share/stories",
    label: "用户回访视频",
    desc: "已购会员的真实回访：使用场景、长期感受、量化反馈。",
  },
  {
    key: "usage",
    href: "/share/usage",
    label: "产品使用及背书",
    desc: "产品操作演示、行业背书、合规与认证信息。",
  },
];

export type ShareEntry = {
  slug: string;
  category: ShareCategoryKey;
  title: string;
  summary: string;
  body: string;
  cover?: string;
  date: string; // YYYY-MM-DD
  author?: string;
  tags?: string[];
};

export const shareEntries: ShareEntry[] = [
  // ===== 科普类 =====
  {
    slug: "fir-wavelength",
    category: "science",
    title: "为什么是 4–14μm？远红外的「生命光波」",
    summary:
      "养生仪为什么选 4–14μm 波段？这一段电磁波和人体细胞共振的物理与生理基础。",
    body:
      "4–14 微米（μm）是远红外光谱中被称为「生命光波」的一段窗口。\n\n" +
      "水的吸收峰、细胞膜脂质双层的共振频率、人体自身辐射的峰值都落在这个区间内——意味着这一段远红外既能被皮肤浅层吸收，也能与深层组织发生非热生物效应（non-thermal bioeffect）。\n\n" +
      "这也是为什么日常晒太阳、靠近壁炉、近红外桑拿给我们的「暖」不一样：波长不同，穿透深度不同，与细胞对话的方式不同。",
    date: "2026-01-15",
    author: "卧宁研究院",
    tags: ["远红外", "波长", "细胞共振"],
  },
  {
    slug: "negative-ions",
    category: "science",
    title: "负氧离子：被低估的副交感激活信号",
    summary:
      "森林里让你觉得「舒服」的，不只是空气——是每立方厘米上百万颗带电水分子簇。",
    body:
      "负氧离子化学式写作 O₂⁻·(H₂O)ₙ，n 一般在 6–30 之间。\n\n" +
      "它们主要通过三条通路影响人体：(1) 经呼吸道沉降后作用于迷走神经末梢，(2) 吸入后改变血清素代谢节奏，(3) 通过皮肤角质层的电学环境调节交感/副交感平衡。\n\n" +
      "目前行业里以 ≥ 5×10⁶ / cm³ 作为「森林级」参考阈值，本产品的工作浓度围绕这个量级设计。",
    date: "2026-02-08",
    author: "卧宁研究院",
    tags: ["负氧离子", "副交感", "森林浓度"],
  },
  {
    slug: "membrane-potential",
    category: "science",
    title: "细胞膜电位：0.5–3Hz 超低频脉冲在做什么",
    summary:
      "睡眠是细胞修复的黄金窗口。极低频电磁脉冲为什么选在 0.5–3Hz 这个区间？",
    body:
      "细胞膜两侧维持着约 –70mV 的静息电位。睡眠期，这一电位会周期性复极化。\n\n" +
      "外加 0.5–3Hz 的超低频脉冲电磁场（PEMF）可与这一内源节律形成共振，帮助维持膜两侧的电势梯度，缩短入睡潜伏期并提升深睡比例。\n\n" +
      "注意：这一频段属于「亚阈」刺激，不会引起神经或肌肉的兴奋，更接近「场效应」而非「刺激效应」。",
    date: "2026-02-22",
    author: "卧宁研究院",
    tags: ["膜电位", "PEMF", "深睡"],
  },

  // ===== 用户回访视频 =====
  {
    slug: "member-shanghai-90d",
    category: "stories",
    title: "90 天回访 · 上海陈先生",
    summary:
      "三个月后体检时，睡眠呼吸暂停指标下来了。深睡比例首次稳定在 28% 以上。",
    body:
      "陈先生 52 岁，私募合伙人。\n\n" +
      "使用 90 天后：日均深睡比例由 17% 提升至 28%，AHI（呼吸暂停指数）由 11.2 降至 6.4。\n\n" +
      "「第一次有产品告诉我深睡比例而不是总时长。」—— 陈先生",
    date: "2026-03-01",
    tags: ["深睡", "AHI", "90天"],
  },
  {
    slug: "member-shenzhen-30d",
    category: "stories",
    title: "30 天回访 · 深圳周先生",
    summary:
      "不是更贵的床垫，是把卧室变成了我家里最关心我的房间。",
    body:
      "周先生 41 岁，科技公司创始人。\n\n" +
      "使用 30 天后：早晨醒来不再伴随决策疲劳，晨间简报比助理更早送达。\n\n" +
      "「AI 不是冷冰冰的仪表盘，是真的懂我什么时候该睡、什么时候该醒。」—— 周先生",
    date: "2026-03-15",
    tags: ["30天", "决策疲劳", "晨间简报"],
  },

  // ===== 产品使用及背书 =====
  {
    slug: "operation-guide",
    category: "usage",
    title: "三合一养生仪 · 上门安装与首次开机",
    summary:
      "60 分钟由专属顾问陪同完成：从拆箱到第一次小睡的完整流程。",
    body:
      "适用城市：北京、上海、广州、深圳、成都。\n\n" +
      "标准流程：\n  1. 拆箱与机位确认（10 分钟）\n  2. 电源与 IoT 网关配网（10 分钟）\n  3. 三机制逐项调试与说明（20 分钟）\n  4. L0 账户建档与第一次小睡（20 分钟）\n\n" +
      "非上述城市收取远程上门服务费，详情见价格页。",
    date: "2026-01-20",
    tags: ["上门", "首次开机", "L0"],
  },
  {
    slug: "certification",
    category: "usage",
    title: "CCC · SRRC · RoHS 三类认证进展",
    summary:
      "电气安全、无线电型号核准、有害物质限制——目前状态与时间表。",
    body:
      "CCC（电气安全 + EMC）：送检完成，进入工厂审查阶段，预计 2026 Q2 取得。\n\n" +
      "SRRC（无线电型号核准）：样品送检中，预计 2026 Q3 取得。\n\n" +
      "RoHS 2.0 / REACH：原材料与成品均已通过，符合性声明归档于品控部。\n\n" +
      "详细认证编号与时间表每月更新。",
    date: "2026-02-20",
    author: "兴旺惟爱 · 品控",
    tags: ["CCC", "SRRC", "RoHS"],
  },
];

// ================ 查询助手 ================

/** 按分类 key 取该分类下全部条目（按日期倒序） */
export function getEntriesByCategory(key: ShareCategoryKey): ShareEntry[] {
  return shareEntries
    .filter((e) => e.category === key)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 按 slug 取单条（同时校验 category 一致性） */
export function getEntry(
  category: ShareCategoryKey,
  slug: string
): ShareEntry | undefined {
  return shareEntries.find(
    (e) => e.category === category && e.slug === slug
  );
}

/** 取一个分类的元数据 */
export function getCategory(
  key: ShareCategoryKey
): ShareCategory | undefined {
  return shareCategories.find((c) => c.key === key);
}