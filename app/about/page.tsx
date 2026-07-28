import { prisma } from "@/lib/db";
import { parseSectionPayload, type AboutSectionType } from "@/lib/about-types";

// 前台页面强制按需渲染，避免 Next.js 缓存后台更新看不到
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { AboutHero } from "@/components/about/AboutHero";
import { AboutFacts } from "@/components/about/AboutFacts";
import { AboutTrust } from "@/components/about/AboutTrust";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutPromise } from "@/components/about/AboutPromise";
import { AboutCta } from "@/components/about/AboutCta";
import type {
  AboutAnyPayload,
  AboutCtaPayload,
  AboutFactsPayload,
  AboutHeroPayload,
  AboutPromisePayload,
  AboutTeamPayload,
  AboutTrustPayload,
} from "@/lib/about-types";

/**
 * About 页服务端渲染
 *
 * 数据源：DB → AboutSection（按 displayOrder 排序，仅 visible=true）
 * fallback：DB 为空时回落到 data/about.ts 种子（保证首屏不空白）
 */
export default async function AboutPage() {
  // build 时跳过 DB 查询
  const dbSections = process.env.NEXT_BUILD_SKIP_DB === "1"
    ? []
    : await prisma.aboutSection.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
  });

  // 兜底：DB 完全为空时，用内联种子数据渲染
  const sections = dbSections.length > 0
    ? dbSections.map((s) => ({
        type: s.type as AboutSectionType,
        payload: parseSectionPayload(s.payload, s.type as AboutSectionType),
      }))
    : null;

  // fallback 内容（DB 空时使用，与 seed 数据一致）
  const FALLBACK = {
    hero: {
      headline:
        "卧宁睡眠科技，成立于 2026 年，专注睡眠健康管理领域的解决方案销售与服务商。",
      subtitle:
        "为养老机构、酒店及企业提供可落地的睡眠健康干预方案，提升服务品质与客户粘性。",
      highlights: [
        { k: "方案 7 天可部署", v: "上门勘察 → 部署 → 培训 → 上线，全流程 7 天闭环" },
        { k: "1 对 1 专属客户经理", v: "项目期一对一负责，需求响应不超过 48 小时" },
        { k: "效果数据可追踪", v: "部署后回访与睡眠改善数据按月反馈给客户方" },
      ],
    } as AboutHeroPayload,
    facts: {
      hq: "中国 · 深圳",
      coreBusiness: "睡眠健康管理解决方案的销售与服务",
      focusAreas: ["养老机构", "高端酒店", "企业健康福利"],
      companyStatus:
        "已完成工商注册，可于「国家企业信用信息公示系统」按统一社会信用代码查询",
      creditCode: "91440300MA5XXXXXXXX",
    } as AboutFactsPayload,
    trust: {
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
          k: "qualification" as const,
          title: "资质备案",
          items: [
            "营业执照（已注册）",
            "二类医疗器械经营备案（申请中）",
            "行业相关许可按项目所在地区办理",
          ],
        },
        {
          k: "ecosystem" as const,
          title: "合作生态",
          items: [
            "产品制造方：兴旺惟爱",
            "睡眠监测硬件：上游品牌授权经销商",
            "IoT 网关：合作方接入",
          ],
        },
        {
          k: "credential" as const,
          title: "专业背书",
          items: [
            "团队成员持有健康管理师 / 睡眠顾问等专业证书",
            "可应客户要求提供证书清单",
          ],
        },
      ],
    } as AboutTrustPayload,
    team: {
      intro:
        "新公司最大的信任资产是团队的专业度。以下是核心成员的真实照片与一句话履历。",
      members: [],
    } as AboutTeamPayload,
    promise: {
      statement:
        "从方案选型到落地部署，我们承诺 48 小时内响应客户需求；7 天内完成首次上门部署。",
      bullets: [
        "48 小时客户需求响应",
        "7 天首次上门部署",
        "按月反馈睡眠改善数据",
      ],
    } as AboutPromisePayload,
    cta: {
      primary: { label: "免费获取睡眠健康解决方案资料", href: "/contact?intent=资料" },
      secondary: { label: "预约方案咨询", href: "/contact?intent=咨询" },
      note: "所有沟通均在您主动发起后启动。我们不通过公开内容主动触达。",
    } as AboutCtaPayload,
  };

  // 渲染派发
  function renderSection(type: AboutSectionType, payload: AboutAnyPayload) {
    switch (type) {
      case "hero":
        return <AboutHero key="hero" data={payload as AboutHeroPayload} />;
      case "facts":
        return <AboutFacts key="facts" data={payload as AboutFactsPayload} />;
      case "trust":
        return <AboutTrust key="trust" data={payload as AboutTrustPayload} />;
      case "team":
        return <AboutTeam key="team" data={payload as AboutTeamPayload} />;
      case "promise":
        return (
          <AboutPromise key="promise" data={payload as AboutPromisePayload} />
        );
      case "cta":
        return <AboutCta key="cta" data={payload as AboutCtaPayload} />;
      default:
        return null;
    }
  }

  return (
    <>
      {sections
        ? sections.map((s) => renderSection(s.type, s.payload))
        : (
          <>
            <AboutHero data={FALLBACK.hero} />
            <AboutFacts data={FALLBACK.facts} />
            <AboutTrust data={FALLBACK.trust} />
            <AboutTeam data={FALLBACK.team} />
            <AboutPromise data={FALLBACK.promise} />
            <AboutCta data={FALLBACK.cta} />
          </>
        )}
    </>
  );
}