/**
 * 全站文案集中管理
 * 风格：标准官网页面 · 林间高端服务风
 * 合规线：第十六章 医疗、分销、数据、融资、合同五条红线
 *
 * 措辞规则：
 *  - 可用：养护、辅助、机制、研究、参考
 *  - 禁用：疗效、治疗、抗衰、防病、逆龄、根治、失眠治愈
 *  - 价格与服务承诺必须明确"非医疗"
 */

// ==================== 品牌主标识 ====================
export const brand = {
  nameZh: "卧宁睡眠",
  nameEn: "WONING",
  tagline: "卧室里的森林节律",
  established: "深圳卧宁睡眠科技有限公司",
  manufacturer: "兴旺惟爱",
  manufacturerNote: "产品厂家",
  brandLine: "由 兴旺惟爱 提供产品制造背书",
};

// ==================== 全站顶部合规声明 ====================
export const complianceBar = {
  text: "卧宁睡眠 · 生命科学应用公司 · 产品为养护设备，不替代医疗诊断与治疗",
};

// ==================== 首页 · Hero ====================
export const hero = {
  eyebrow: "FOREST × SLEEP TECHNOLOGY",
  headline: ["把卧室", "调成森林的节律", "—— 而这件事，是 AI 在做"],
  subhead:
    "一台机器承载远红外、负氧离子与细胞膜电位三种作用机制，并以 IoT 网关接入 AI 精力管家，为高净值人群提供家庭端精准健康管理。",
  primaryCta: "预约现场体验",
  secondaryCta: "查看价格",
  whisper: "灯光 · 温度 · 声音 · 气息——与一片常青林同步。",
};

// ==================== 首页 · ProductFeature ====================
export const productFeature = {
  videos: [
    {
      id: "01",
      src: "/videos/product-fir.mp4",
      label: "远红外",
      caption: "Far Infrared",
      angle: "Mechanism 01",
    },
    {
      id: "02",
      src: "/videos/product-ions.mp4",
      label: "负氧离子",
      caption: "Negative Air Ions",
      angle: "Mechanism 02",
    },
    {
      id: "03",
      src: "/videos/product-membrane.mp4",
      label: "细胞膜电位",
      caption: "Membrane Potential",
      angle: "Mechanism 03",
    },
    {
      id: "04",
      src: "/videos/product-app.mp4",
      label: "APP 联动",
      caption: "App Sync",
      angle: "Interface",
    },
  ] as {
    id: string;
    src: string;
    label: string;
    caption: string;
    angle: string;
  }[],
};

// ==================== 首页 · 月光宝宝盒（伴侣） ====================
export const moonlightBox = {
  eyebrow: "THE COMPANION",
  title: "卧宁睡眠.月光宝盒",
  intro:
    "三合一养生仪的床头伴侣。掌心大小的小盒子，在入睡前 30 分钟以同步光、声、气息与卧室氛围共鸣——不需要复杂操作，月光宝宝盒自己懂。",
  price: "¥4,800",
  videos: [
    {
      id: "01",
      src: "/videos/moonlight-light.mp4",
      label: "暖光渐暗",
      caption: "Light Dusk",
      angle: "Hero shot",
    },
    {
      id: "02",
      src: "/videos/moonlight-sound.mp4",
      label: "森林之声",
      caption: "Forest Sound",
      angle: "Lifestyle",
    },
    {
      id: "03",
      src: "/videos/moonlight-aroma.mp4",
      label: "实木香薰",
      caption: "Wood Aroma",
      angle: "Detail",
    },
    {
      id: "04",
      src: "/videos/moonlight-sync.mp4",
      label: "主机联动",
      caption: "Sync with Hub",
      angle: "Engineering",
    },
  ] as {
    id: string;
    src: string;
    label: string;
    caption: string;
    angle: string;
  }[],
};

// ==================== 首页 · 客户证言 ====================
export const testimonials = {
  eyebrow: "FROM EARLY MEMBERS",
  title: "已经穿过这片森林的人",
  items: [
    {
      quote: "第一次有产品告诉我深睡比例而不是总时长。三个月后体检时，睡眠呼吸暂停的指标下来了。",
      name: "陈先生",
      tag: "私募合伙人 · 上海",
    },
    {
      quote: "夜里不再因决策疲劳醒来。早晨的简报比我助理更早醒来。",
      name: "林女士",
      tag: "家族办公室负责人 · 香港",
    },
    {
      quote: "不是更贵的床垫，是把卧室变成了我家里最关心我的房间。",
      name: "周先生",
      tag: "科技公司创始人 · 深圳",
    },
  ] as { quote: string; name: string; tag: string }[],
};

// ==================== 首页 · CTA ====================
export const cta = {
  eyebrow: "BY INVITATION",
  title: "预约一次卧室的现场体验",
  sub: "仅限受邀。预约后由专属顾问与您确认时间与场景。",
  fields: [
    { name: "name", label: "称呼", type: "text" as const, placeholder: "先生 / 女士" },
    {
      name: "phone",
      label: "手机号",
      type: "tel" as const,
      placeholder: "我们将通过短信确认",
    },
    { name: "city", label: "所在城市", type: "text" as const, placeholder: "如：上海" },
  ],
  primary: "提交预约",
  secondary: "或致电专属顾问 400-XXX-XXXX",
  note: "我们不通过公开内容主动触达您，所有沟通均在您主动预约后启动。",
};

// ==================== 导航 ====================
export const nav = {
  items: [
    { href: "/", label: "首页" },
    { href: "/product", label: "产品" },
    {
      href: "/share",
      label: "产品分享",
      children: [
        { href: "/share/science", label: "科普类" },
        { href: "/share/stories", label: "用户回访视频" },
        { href: "/share/usage", label: "产品使用及背书" },
      ],
    },
    { href: "/privacy", label: "隐私" },
    { href: "/pricing", label: "价格" },
    { href: "/about", label: "关于" },
    { href: "/contact", label: "联系" },
  ] as {
    href: string;
    label: string;
    children?: { href: string; label: string }[];
  }[],
};

// ==================== 产品分享 ====================
// 内容已迁移到 data/share.ts，配套动态路由 app/share/*
// 这里仅保留 nav 用的顶层入口
export const productShare = {
  eyebrow: "PRODUCT SHARING",
  title: "产品分享",
  intro: "真实场景里的产品使用、用户回访与机制科普——不修饰，不夸张。",
};

// ==================== 页脚 ====================
export const footer = {
  brandNote: "对外服务品牌：卧宁睡眠（深圳卧宁睡眠科技有限公司运营） · 产品厂家：兴旺惟爱",
  legal: [
    { label: "隐私政策", href: "#" },
    { label: "服务条款", href: "#" },
    { label: "免责声明", href: "#" },
    { label: "合作申请", href: "/contact" },
  ],
  copyright: "© 2026 深圳卧宁睡眠科技有限公司 · 保留所有权利",
};

// ==================== 子页面 PageHero ====================
export const pageHero = {
  product: {
    eyebrow: "HARDWARE",
    title: "兴旺惟爱三合一养生仪",
    sub: "远红外 · 负氧离子 · 细胞膜电位 · IoT 网关",
  },
  pricing: {
    eyebrow: "TRANSPARENT PRICING",
    title: "公开透明 · 一个价格",
    sub: "无隐藏附加 · 无订阅绑定 · 首年赠送 L0 账户建档",
  },
  about: {
    eyebrow: "ABOUT",
    title: "把一台养生仪，做成一家生命科学公司",
    sub: "深圳卧宁睡眠科技有限公司 · 兴旺惟爱 · AI 运营引擎 opc-platform",
  },
  contact: {
    eyebrow: "CONTACT",
    title: "期待与您见一面",
    sub: "中国大陆主要城市上门体验 · 公开内容不主动触达",
  },
  engineering: {
    eyebrow: "ENGINEERING",
    title: "工程，是把科学做成日常",
    sub: "远红外 · 负氧离子 · 细胞膜电位 · IoT 网关 — 四条线同时被一台机器承担",
  },
  privacy: {
    eyebrow: "PRIVACY",
    title: "卧室里发生的事，不应离开卧室",
    sub: "数据最小化 · 本地优先 · 端到端加密 · 你拥有并可随时删除",
  },
  specs: {
    eyebrow: "TECH SPECS",
    title: "完整技术参数",
    sub: "硬件 · 连接 · 电源 · 尺寸 · 环境 · 合规",
  },
  share: {
    eyebrow: "PRODUCT SHARING",
    title: "产品分享",
    sub: "真实场景里的产品使用、用户回访与机制科普——不修饰，不夸张。",
  },
};

// ==================== 产品页 ====================
export const productPage = {
  intro:
    "兴旺惟爱三合一养生仪是卧宁系统的硬件入口。它既是卧室里的养护设备，也是 IoT 网关，把卧室里所有的感知数据汇集到一个长期可成长的账户。",
  mechanisms: [
    {
      key: "远红外",
      en: "Far Infrared · 4–14μm",
      label: "生命光波",
      body: "激活 eNOS、改善微循环；被线粒体吸收后提升 ATP 合成效率。",
    },
    {
      key: "负氧离子",
      en: "Negative Air Ions · O₂⁻(H₂O)ₙ",
      label: "副交感激活",
      body: "抑制过度活跃的交感神经，与皮质醇下降相关。",
    },
    {
      key: "细胞膜电位",
      en: "Membrane Potential",
      label: "跨膜电势",
      body: "睡眠期为细胞修复与再生的黄金窗口。",
    },
  ] as { key: string; en: string; label: string; body: string }[],
  specs: [
    { label: "远红外", value: "4–14μm", note: "「生命光波」波段" },
    { label: "负氧离子", value: "≥ 5×10⁶ / cm³", note: "副交感激活" },
    { label: "细胞膜电位", value: "超低频脉冲电磁场", note: "跨膜电势调节" },
    { label: "IoT 网关", value: "Wi-Fi 6 / BLE 5.2", note: "汇集卧室传感" },
    { label: "应用场景", value: "卧室 / 书房", note: "家庭端使用" },
  ] as { label: string; value: string; note: string }[],
  compliance:
    "本产品为家用睡眠辅助设备，非医疗器械；不替代医疗诊断与治疗；不构成对失眠、抑郁、焦虑等疾病的疗效承诺。",
};

// ==================== 关于页 ====================
export const aboutPage = {
  intro:
    "我们做的事，是把一台养生仪做成一间生命科学公司。第一件事是把「我们是谁」讲清楚。",
  positioning: [
    {
      k: "以睡眠为切入口",
      v: "睡眠是最高频、最私密、最易被科技改善的健康入口。它不是边界，而是切入口。",
    },
    {
      k: "以 AI 为整合引擎",
      v: "我们不是某一项技术的卖家，而是把多学科成果整合落地的工程化平台。",
    },
    {
      k: "家庭端精准健康",
      v: "场景锚定在卧室这一最适宜长期追踪的空间。",
    },
  ] as { k: string; v: string }[],
  manufacturerNote:
    "产品由 兴旺惟爱 提供制造背书；AI 运营引擎由 opc-platform 提供；对外服务品牌由 深圳卧宁睡眠科技有限公司 运营。",
};

// ==================== 价格页 ====================
export const pricingPage = {
  intro: "清晰、透明、一个价格。所有报价含税，不含额外订阅。",
  includesTable: [
    { label: "三合一养生仪主机", value: "× 1", note: "远红外 · 负氧离子 · 细胞膜电位" },
    { label: "IoT 网关", value: "× 1", note: "Wi-Fi 6 / BLE 5.2" },
    { label: "L0 账户建档", value: "免费", note: "数据按 L1/L2 兼容结构存储" },
    { label: "首年质保", value: "12 个月", note: "整机 · 非人为损坏" },
    { label: "上门安装", value: "1 次", note: "北上广深 · 其他城市额外计费" },
    { label: "专属顾问", value: "首年", note: "线下一对一沟通权限" },
  ] as { label: string; value: string; note: string }[],
  firstYearRights: [
    "首年 4,000 台售罄后将提价",
    "已购会员享 L1 AI 订阅首发优惠（2027 年开放）",
    "可升级为家族账户（限 3 位家庭成员）",
    "高端酒店样板间体验权益（覆盖 3 城）",
  ] as string[],
  faq: [
    {
      q: "这是医疗器械吗？",
      a: "不是。本产品为家用睡眠辅助设备，非医疗器械，不替代医疗诊断与治疗。",
    },
    {
      q: "是否需要月费或订阅？",
      a: "无。当前不绑定任何订阅。L1 AI 订阅为路线图阶段产品，已购会员将单独通知首发优惠。",
    },
    {
      q: "可以试用吗？",
      a: "可以预约一次卧室的现场体验，体验时长约 60 分钟，由专属顾问陪同。预约请前往「联系」页。",
    },
  ] as { q: string; a: string }[],
  complianceNote:
    "本产品为家用睡眠辅助设备，非医疗器械。所有宣传不构成对失眠、抑郁、焦虑等疾病的疗效承诺。",
};

// ==================== 联系页 ====================
export const contactPage = {
  intro: "我们相信关系比流量更重要。所有沟通均在您主动预约后启动。",
  stores: [
    { city: "上海", address: "徐汇区衡山路 884 号 · 体验中心", hours: "预约制 · 10:00–20:00" },
    { city: "深圳", address: "南山区科苑南路 999 号 · 体验中心", hours: "预约制 · 10:00–20:00" },
    { city: "北京", address: "朝阳区建国门外大街 1 号 · 体验中心", hours: "筹备中 · 2026 年开放" },
  ] as { city: string; address: string; hours: string }[],
  services: [
    {
      title: "客户预约",
      desc: "已有产品或账户的客户，请通过专属顾问沟通。",
      action: "邮件 · member@woningsleep.com",
    },
    {
      title: "媒体合作",
      desc: "采访、行业活动、品牌联名。",
      action: "邮件 · press@woningsleep.com",
    },
    {
      title: "经销合作",
      desc: "区域合伙人、零售门店、高端酒店。",
      action: "邮件 · partner@woningsleep.com",
    },
  ] as { title: string; desc: string; action: string }[],
};

// ==================== 工程师工艺页 ====================
export const engineeringPage = {
  heroSub:
    "一台机器同时承担远红外发射、负氧离子生成、超低频脉冲电磁场发生、IoT 边缘网关四种工作。这是硬件工程与软件工程在同一外壳下的第一次完整闭环。",
  pillars: [
    {
      key: "materials",
      name: "Materials · 原料",
      title: "从源头挑起的每一寸材料",
      body: "外壳使用 FSC 认证实木复合板；远红外陶瓷粉体来自指定供应商；负氧离子发生电极采用医用级钛合金。每批次出具光谱与离子浓度的来料检验报告。",
      tags: ["FSC 认证实木", "医用级钛合金", "光谱来料检验"],
    },
    {
      key: "mechanisms",
      name: "Mechanisms · 机制",
      title: "三条机制同时发射，互不干扰",
      body: "4–14μm 远红外由低温陶瓷粉体激发；负氧离子 O₂⁻·(H₂O)ₙ 由尖端放电阵列生成；细胞膜电位由 0.5–3 Hz 超低频脉冲线圈产生。三条机制在电气上独立、在生物端产生共振。",
      tags: ["4–14μm FIR", "尖端放电负氧离子", "0.5–3 Hz 脉冲"],
    },
    {
      key: "firmware",
      name: "Firmware · 控制",
      title: "边缘层先回应，云端只在它要说话时说话",
      body: "卧室里所有的照明、温度、声音都在本地毫秒级闭环。云端因果引擎只在需要趋势分析、晨间简报或模型更新时才介入。",
      tags: ["本地毫秒级闭环", "云端按需介入", "可解释日志"],
    },
    {
      key: "manufacturing",
      name: "Manufacturing · 制造",
      title: "由 兴旺惟爱 在中国境内完成全流程制造",
      body: "整机 SMT、AI 老化、EMC 实验室、长运测试、终检出厂全过程均由 兴旺惟爱 完成；驻厂质量代表对每批次签发可追溯记录。",
      tags: ["境内全流程", "EMC 实验室", "每批次可追溯"],
    },
  ] as { key: string; name: string; title: string; body: string; tags: string[] }[],
  testingSteps: [
    { k: "01", t: "原料光谱与离子浓度检验", d: "每批粉体、电极、电芯出具检验报告，无合格不入库。" },
    { k: "02", t: "EMC 与安规摸底测试", d: "辐射骚扰、静电放电、浪涌、绝缘耐压 —— 通过 CCC 与自愿性认证。" },
    { k: "03", t: "老化与长运测试", d: "72 小时连续满载运行、模拟五年使用强度的加速实验。" },
    { k: "04", t: "终检与人因抽样", d: "出厂前人因抽样，验证噪声、温升、操作体验、按钮手感。" },
  ] as { k: string; t: string; d: string }[],
};

// ==================== 隐私页 ====================
export const privacyPage = {
  intro:
    "你的卧室，是你这辈子最私密的房间。我们认为这件事值得被认真对待。",
  principles: [
    {
      icon: "minimize",
      title: "数据最小化",
      body: "我们只采集让产品为你服务所必需的数据。不会为了「可以」采集一切，绝不会把数据用于广告或训练通用模型。",
    },
    {
      icon: "local",
      title: "本地优先",
      body: "卧室里的环境控制、节律判断、急性反应处理，全部在你的家本地完成。云端仅在你主动触发时介入。",
    },
    {
      icon: "ownership",
      title: "数据归你",
      body: "你拥有并可随时下载、随时删除你的全部数据。账户注销即触发不可逆删除，备份在 90 天内全部清除。",
    },
    {
      icon: "audit",
      title: "可被审计",
      body: "我们邀请第三方安全机构对核心系统进行年度安全审计，并在本页公开摘要。",
    },
  ] as { icon: string; title: string; body: string }[],
  compliance: [
    { k: "PIPL", v: "中华人民共和国个人信息保护法" },
    { k: "GDPR", v: "EU General Data Protection Regulation" },
    { k: "CCC", v: "中国强制性产品认证（电气安全 + EMC）" },
    { k: "ISO/IEC 27001", v: "信息安全管理体系 · 路线图 2027" },
  ] as { k: string; v: string }[],
  contact: {
    title: "数据保护官",
    name: "数据保护团队",
    email: "privacy@woningsleep.com",
    response: "工作日 24 小时内回复",
  },
};

// ==================== 完整规格页 ====================
export const specsPage = {
  intro: "所有参数公开。所有数值基于 2026 年首批量产品型。",
  groups: [
    {
      name: "Hardware · 硬件",
      items: [
        { label: "远红外波段", value: "4–14 μm" },
        { label: "远红外发射功率", value: "≤ 8 W" },
        { label: "负氧离子化学式", value: "O₂⁻ · (H₂O)ₙ" },
        { label: "负氧离子浓度", value: "≥ 5×10⁶ / cm³" },
        { label: "细胞膜电位脉冲", value: "0.5–3 Hz · 超低频" },
        { label: "IoT 网关", value: "Wi-Fi 6 / BLE 5.2" },
        { label: "主控芯片", value: "ARM Cortex-A55 四核" },
        { label: "本地存储", value: "32 GB eMMC" },
      ],
    },
    {
      name: "Power · 电源",
      items: [
        { label: "额定电压", value: "AC 220 V / 50 Hz" },
        { label: "额定功率", value: "≤ 120 W" },
        { label: "待机功耗", value: "≤ 0.5 W" },
        { label: "充电接口", value: "USB-C（维护用）" },
      ],
    },
    {
      name: "Physical · 尺寸与重量",
      items: [
        { label: "主机尺寸", value: "320 × 220 × 480 mm" },
        { label: "主机净重", value: "8.6 kg" },
        { label: "包装尺寸", value: "420 × 320 × 580 mm" },
        { label: "包装重量", value: "11.2 kg" },
      ],
    },
    {
      name: "Environment · 工作环境",
      items: [
        { label: "工作温度", value: "5–40 °C" },
        { label: "工作湿度", value: "20–80 % RH（无凝露）" },
        { label: "储运温度", value: "−20 至 60 °C" },
        { label: "海拔", value: "≤ 3000 m" },
      ],
    },
    {
      name: "Compliance · 合规",
      items: [
        { label: "CCC 认证", value: "电气安全 + EMC · 在办" },
        { label: "无线电型号核准", value: "SRRC · 在办" },
        { label: "数据合规", value: "PIPL · GDPR ready" },
        { label: "环境", value: "RoHS 2.0 / REACH" },
      ],
    },
    {
      name: "In the Box · 装箱清单",
      items: [
        { label: "三合一养生仪主机", value: "× 1" },
        { label: "IoT 网关（已内置）", value: "× 1" },
        { label: "电源线", value: "× 1 · 1.8 m" },
        { label: "用户手册 + 合规声明", value: "× 1" },
        { label: "专属顾问名片", value: "× 1" },
      ],
    },
  ] as { name: string; items: { label: string; value: string }[] }[],
  certifications: [
    { k: "CCC", n: "电气安全 + EMC", status: "在办" },
    { k: "SRRC", n: "无线电型号核准", status: "在办" },
    { k: "RoHS", n: "有害物质限制", status: "符合" },
    { k: "FSC", n: "实木复合板原料认证", status: "符合" },
  ] as { k: string; n: string; status: string }[],
};
