/**
 * 初始数据导入：
 *  - 创建初始 admin 账号（凭据从 .env 读）
 *  - 把 data/share.ts 的 7 条种子条目导入 DB
 *  - 把 data/about.ts 的 6 条 About 区块种子导入 DB（按 displayOrder 写入）
 *  - 把 data/home.ts 的 4 条 HomeSection 种子导入 DB（按 displayOrder 写入）
 *
 * 运行：npx prisma db seed
 * （package.json 已配 "prisma": { "seed": "tsx prisma/seed.ts" }）
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { shareEntries } from "../data/share";
import { ABOUT_SECTIONS } from "../data/about";
import { HOME_SECTIONS } from "../data/home";

const prisma = new PrismaClient();

async function main() {
  // ---- admin ----
  const email = process.env.ADMIN_EMAIL || "admin@woning.local";
  const password = process.env.ADMIN_PASSWORD || "卧宁2026!";
  const name = process.env.ADMIN_NAME || "初始管理员";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role: "admin" },
    create: { email, name, passwordHash, role: "admin" },
  });

  console.log(`✓ admin 已就绪：${admin.email} (id=${admin.id})`);

  // ---- 7 条种子条目 ----
  let created = 0;
  let skipped = 0;

  for (const e of shareEntries) {
    const exists = await prisma.entry.findUnique({
      where: { category_slug: { category: e.category, slug: e.slug } },
    });
    if (exists) {
      skipped++;
      continue;
    }

    // payload 转成 V3 字段结构
    const payload = JSON.stringify({
      title_zh: e.title,
      title_en: "",
      summary_zh: e.summary,
      summary_en: "",
      body_zh: e.body,
      body_en: "",
      cover: e.cover ?? "",
      tags: e.tags ?? [],
      author: e.author ?? "",
      date: e.date,
    });

    const entry = await prisma.entry.create({
      data: {
        slug: e.slug,
        category: e.category,
        status: "published",
        publishedAt: new Date(e.date),
        drafts: {
          create: {
            payload,
            updatedById: admin.id,
          },
        },
        versions: {
          create: {
            version: 1,
            payload,
            publishedById: admin.id,
            note: "seed 初始导入",
          },
        },
      },
    });

    created++;
    console.log(`  + [${e.category}] ${e.slug} → ${entry.id}`);
  }

  console.log(`\n✓ share seed 完成：新建 ${created} 条，跳过 ${skipped} 条已存在条目。`);

  // ---- 6 条 About 区块 ----
  let aboutCreated = 0;
  let aboutSkipped = 0;

  for (const s of ABOUT_SECTIONS) {
    const order = ABOUT_SECTIONS.indexOf(s) + 1;
    const exists = await prisma.aboutSection.findUnique({
      where: { displayOrder: order },
    });
    if (exists) {
      aboutSkipped++;
      continue;
    }
    await prisma.aboutSection.create({
      data: {
        displayOrder: order,
        type: s.type,
        title: s.title,
        visible: true,
        payload: JSON.stringify(s.payload),
        updatedById: admin.id,
      },
    });
    aboutCreated++;
    console.log(`  + [about] ${s.type} → order=${order}`);
  }

  console.log(
    `\n✓ about seed 完成：新建 ${aboutCreated} 区块，跳过 ${aboutSkipped} 已存在区块。`
  );

  // ---- 4 条 HomeSection 区块 ----
  let homeCreated = 0;
  let homeSkipped = 0;

  for (const s of HOME_SECTIONS) {
    const order = HOME_SECTIONS.indexOf(s) + 1;
    const exists = await prisma.homeSection.findUnique({
      where: { displayOrder: order },
    });
    if (exists) {
      homeSkipped++;
      continue;
    }
    await prisma.homeSection.create({
      data: {
        displayOrder: order,
        type: s.type,
        title: s.title,
        visible: true,
        payload: JSON.stringify(s.payload),
        updatedById: admin.id,
      },
    });
    homeCreated++;
    console.log(`  + [home] ${s.type} → order=${order}`);
  }

  console.log(
    `\n✓ home seed 完成：新建 ${homeCreated} 区块，跳过 ${homeSkipped} 已存在区块。`
  );
}

main()
  .catch((e) => {
    console.error("seed 失败：", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());