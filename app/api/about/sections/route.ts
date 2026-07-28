/**
 * GET /api/about/sections
 * 前台公开接口：按 displayOrder 返回 visible=true 的所有区块
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseSectionPayload } from "@/lib/about-types";

export async function GET() {
  // build 时跳过：build 阶段 DB 不可用
  if (process.env.NEXT_BUILD_SKIP_DB === "1") {
    return NextResponse.json({ sections: [] });
  }
  const sections = await prisma.aboutSection.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
  });

  // payload 在 DB 是 string JSON；前端直接拿到结构化对象
  const enriched = sections.map((s) => ({
    id: s.id,
    type: s.type,
    displayOrder: s.displayOrder,
    title: s.title,
    payload: parseSectionPayload(s.payload, s.type as never),
  }));

  return NextResponse.json({ sections: enriched });
}