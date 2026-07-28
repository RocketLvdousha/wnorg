/**
 * 首页 HomeSection 的种子数据
 *
 * 与 lib/content.ts 的 productFeature / moonlightBox / testimonials / cta 保持一致；
 * 迁移时把现有静态数据搬到 DB，前台页面继续按相同框架渲染。
 *
 * media.src 用 /videos/... 和 /uploads/videos/... 都是合法路径：
 *   - /videos/... 在 public/videos/ 下，git 里自带
 *   - /uploads/videos/... 由 admin 后台上传得到
 */
import type {
  ProductShowcasePayload,
  TestimonialsPayload,
  CtaPayload,
  HomeSectionType,
} from "../lib/home-types";

export const HOME_SECTIONS: {
  type: HomeSectionType;
  title: string;
  payload:
    | ProductShowcasePayload
    | TestimonialsPayload
    | CtaPayload;
}[] = [
  // ---------- 1. 主产品 ----------
  {
    type: "product",
    title: "主产品展示 · 卧宁睡眠.卫家精灵",
    payload: {
      name: "卧宁睡眠.卫家精灵",
      intro:
        "兴旺惟爱三合一养生仪是卧宁系统的硬件入口。它既是卧室里的养护设备，也是 IoT 网关，把卧室里所有的感知数据汇集到一个长期可成长的账户。",
      price: "¥29,800",
      priceNote: "含税 · 一个价格",
      primaryCta: { label: "查看产品详情", href: "/product" },
      secondaryCta: { label: "价格与权益", href: "/pricing" },
      media: [
        {
          id: "pf-01",
          src: "/videos/product-fir.mp4",
          kind: "video",
          label: "远红外",
          caption: "Far Infrared",
          angle: "Mechanism 01",
        },
        {
          id: "pf-02",
          src: "/videos/product-ions.mp4",
          kind: "video",
          label: "负氧离子",
          caption: "Negative Air Ions",
          angle: "Mechanism 02",
        },
        {
          id: "pf-03",
          src: "/videos/product-membrane.mp4",
          kind: "video",
          label: "细胞膜电位",
          caption: "Membrane Potential",
          angle: "Mechanism 03",
        },
        {
          id: "pf-04",
          src: "/videos/product-app.mp4",
          kind: "video",
          label: "APP 联动",
          caption: "App Sync",
          angle: "Interface",
        },
      ],
    } as ProductShowcasePayload,
  },

  // ---------- 2. 月光宝盒 ----------
  {
    type: "companion",
    title: "伴侣 · 月光宝盒",
    payload: {
      name: "月光宝盒",
      intro:
        "三合一养生仪的床头伴侣。掌心大小的小盒子，在入睡前 30 分钟以同步光、声、气息与卧室氛围共鸣——不需要复杂操作，月光宝宝盒自己懂。",
      price: "¥4,800",
      priceNote: "含税 · 一个价格",
      primaryCta: { label: "查看产品详情", href: "/product" },
      secondaryCta: { label: "价格与权益", href: "/pricing" },
      media: [
        {
          id: "mb-01",
          src: "/videos/moonlight-light.mp4",
          kind: "video",
          label: "暖光渐暗",
          caption: "Light Dusk",
          angle: "Hero shot",
        },
        {
          id: "mb-02",
          src: "/videos/moonlight-sound.mp4",
          kind: "video",
          label: "森林之声",
          caption: "Forest Sound",
          angle: "Lifestyle",
        },
        {
          id: "mb-03",
          src: "/videos/moonlight-aroma.mp4",
          kind: "video",
          label: "实木香薰",
          caption: "Wood Aroma",
          angle: "Detail",
        },
        {
          id: "mb-04",
          src: "/videos/moonlight-sync.mp4",
          kind: "video",
          label: "主机联动",
          caption: "Sync with Hub",
          angle: "Engineering",
        },
      ],
    } as ProductShowcasePayload,
  },

  // ---------- 3. 客户证言 ----------
  {
    type: "testimonials",
    title: "客户证言",
    payload: {
      eyebrow: "FROM EARLY MEMBERS",
      title: "已经穿过这片森林的人",
      items: [
        {
          quote:
            "第一次有产品告诉我深睡比例而不是总时长。三个月后体检时，睡眠呼吸暂停的指标下来了。",
          name: "陈先生",
          tag: "私募合伙人 · 上海",
        },
        {
          quote:
            "夜里不再因决策疲劳醒来。早晨的简报比我助理更早醒来。",
          name: "林女士",
          tag: "家族办公室负责人 · 香港",
        },
        {
          quote:
            "不是更贵的床垫，是把卧室变成了我家里最关心我的房间。",
          name: "周先生",
          tag: "科技公司创始人 · 深圳",
        },
      ],
    } as TestimonialsPayload,
  },

  // ---------- 4. 首页底部 CTA ----------
  {
    type: "cta",
    title: "首页底部 CTA",
    payload: {
      eyebrow: "BY INVITATION",
      title: "预约一次卧室的现场体验",
      sub: "仅限受邀。预约后由专属顾问与您确认时间与场景。",
      primary: "提交预约",
      secondary: "或致电专属顾问 400-XXX-XXXX",
      note: "我们不通过公开内容主动触达您，所有沟通均在您主动预约后启动。",
      fields: [
        { name: "name", label: "称呼", type: "text", placeholder: "先生 / 女士" },
        {
          name: "phone",
          label: "手机号",
          type: "tel",
          placeholder: "我们将通过短信确认",
        },
        { name: "city", label: "所在城市", type: "text", placeholder: "如：上海" },
      ],
    } as CtaPayload,
  },
];