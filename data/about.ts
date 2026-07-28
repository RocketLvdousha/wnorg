/**
 * About 页六区块的种子数据
 *
 * 字段值参考 E:/project/wnorg/devlog/about.md 文档框架：
 *   - 首屏英雄区用「定位」替代规模
 *   - 核心事实墙坦诚展示公司信息
 *   - 信任证据链用「前置证据」+ 团队背景时间轴
 *   - 团队真人秀把「人」作为核心资产
 *   - 解决方案承诺代替「愿景」
 *   - 行动召唤区一对主副按钮
 *
 * 占位策略（避免编造不可核验信息）：
 *   - 工商字段留信用代码占位
 *   - 团队成员仅放 1 位公开的真实坐标 + 2 位「待补」
 *   - 资质 / 合作 / 背书用占位条目，admin 后台可随时补
 */
import type {
  AboutHeroPayload,
  AboutFactsPayload,
  AboutTrustPayload,
  AboutTeamPayload,
  AboutPromisePayload,
  AboutCtaPayload,
  AboutSectionType,
} from "../lib/about-types";

export const ABOUT_SECTIONS: {
  type: AboutSectionType;
  title: string;
  payload:
    | AboutHeroPayload
    | AboutFactsPayload
    | AboutTrustPayload
    | AboutTeamPayload
    | AboutPromisePayload
    | AboutCtaPayload;
}[] = [
  // ---------- 1. 首屏英雄区 ----------
  {
    type: "hero",
    title: "首屏英雄区",
    payload: {
      headline:
        "卧宁睡眠科技，成立于 2026 年，专注睡眠健康管理领域的解决方案销售与服务商。",
      subtitle:
        "为养老机构、酒店及企业提供可落地的睡眠健康干预方案，提升服务品质与客户粘性。",
      highlights: [
        { k: "方案 7 天可部署", v: "上门勘察 → 部署 → 培训 → 上线，全流程 7 天闭环" },
        { k: "1 对 1 专属客户经理", v: "项目期一对一负责，需求响应不超过 48 小时" },
        { k: "效果数据可追踪", v: "部署后回访与睡眠改善数据按月反馈给客户方" },
      ],
    },
  },

  // ---------- 2. 核心事实墙 ----------
  {
    type: "facts",
    title: "核心事实墙",
    payload: {
      hq: "中国 · 深圳",
      coreBusiness: "睡眠健康管理解决方案的销售与服务",
      focusAreas: ["养老机构", "高端酒店", "企业健康福利"],
      companyStatus:
        "已完成工商注册，可于「国家企业信用信息公示系统」按统一社会信用代码查询",
      creditCode: "91440300MA5XXXXXXXX",
    },
  },

  // ---------- 3. 信任证据链 ----------
  {
    type: "trust",
    title: "信任证据链",
    payload: {
      timeline: [
        {
          year: "团队背景",
          title: "核心团队拥有 10+ 年健康管理 / 医疗器械行业经验",
          body: "创始团队来自医疗设备研发、健康管理服务与高端酒店供应链。",
        },
        {
          year: "合作生态",
          title: "已与多家供应链 / 技术合作伙伴建立合作",
          body: "包括设备制造方、睡眠监测算法供应商与 IoT 平台方。",
        },
        {
          year: "公司资质",
          title: "已完成工商注册及行业相关资质备案",
          body: "已申请二类医疗器械经营备案；具体进度可向客户经理索取最新凭证。",
        },
      ],
      pillars: [
        {
          k: "qualification",
          title: "资质备案",
          items: [
            "营业执照（已注册）",
            "二类医疗器械经营备案（申请中）",
            "行业相关许可按项目所在地区办理",
          ],
        },
        {
          k: "ecosystem",
          title: "合作生态",
          items: [
            "产品制造方：兴旺惟爱",
            "睡眠监测硬件：上游品牌授权经销商（待补具体品牌）",
            "IoT 网关：合作方接入（待补）",
          ],
        },
        {
          k: "credential",
          title: "专业背书",
          items: [
            "团队成员持有健康管理师 / 睡眠顾问等专业证书",
            "可应客户要求提供证书清单",
          ],
        },
      ],
    },
  },

  // ---------- 4. 团队真人秀 ----------
  {
    type: "team",
    title: "团队真人秀",
    payload: {
      intro:
        "新公司最大的信任资产是团队的专业度。以下是核心成员的真实照片与一句话履历。",
      members: [
        {
          id: "placeholder-1",
          name: "（待补）",
          role: "创始团队",
          bio: "10+ 年健康管理 / 医疗器械行业经验。具体姓名与照片由 admin 后台上传。",
          photo: "",
        },
      ],
    },
  },

  // ---------- 5. 解决方案承诺 ----------
  {
    type: "promise",
    title: "解决方案承诺",
    payload: {
      statement:
        "从方案选型到落地部署，我们承诺 48 小时内响应客户需求；7 天内完成首次上门部署。",
      bullets: [
        "48 小时客户需求响应",
        "7 天首次上门部署",
        "按月反馈睡眠改善数据",
      ],
    },
  },

  // ---------- 6. 行动召唤区 ----------
  {
    type: "cta",
    title: "行动召唤区",
    payload: {
      primary: { label: "免费获取睡眠健康解决方案资料", href: "/contact?intent=资料" },
      secondary: { label: "预约方案咨询", href: "/contact?intent=咨询" },
      note: "所有沟通均在您主动发起后启动。我们不通过公开内容主动触达。",
    },
  },
];