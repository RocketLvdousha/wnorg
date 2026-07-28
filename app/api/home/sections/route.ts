/**
 * GET /api/home/sections
 * 前台公开接口：按 displayOrder 返回 visible=true 的所有首页区块
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseHomePayload } from "@/lib/home-types";

export async function GET() {
  if (process.env.NEXT_BUILD_SKIP_DB === "1") {
    return NextResponse.json({ sections: [] });
  }
  const sections = await prisma.homeSection.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
  });

  const enriched = sections.map((s) => ({
    id: s.id,
    type: s.type,
    displayOrder: s.displayOrder,
    title: s.title,
    payload: parseHomePayload(s.payload, s.type as never),
  }));

  return NextResponse.json({ sections: enriched });
}