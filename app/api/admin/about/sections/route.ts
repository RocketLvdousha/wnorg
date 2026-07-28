/**
 * GET /api/admin/about/sections
 * 列出全部 About 区块（含 invisible），按 displayOrder 排序
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin-session";

export async function GET() {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const sections = await prisma.aboutSection.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json({ sections });
}

/**
 * POST /api/admin/about/sections
 * 新建/初始化某个区块（通常只在首次 seed 缺失时调用）
 * body: { type, payload, title?, visible? }
 */
export async function POST(req: Request) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const body = (await req.json()) as {
    type?: string;
    payload?: unknown;
    title?: string;
    visible?: boolean;
  };
  if (!body.type) {
    return NextResponse.json({ error: "缺少 type" }, { status: 400 });
  }

  // 自动分配 displayOrder：取最大 + 1
  const last = await prisma.aboutSection.findFirst({
    orderBy: { displayOrder: "desc" },
  });
  const order = (last?.displayOrder ?? 0) + 1;

  const section = await prisma.aboutSection.create({
    data: {
      displayOrder: order,
      type: body.type,
      title: body.title ?? body.type,
      visible: body.visible ?? true,
      payload: JSON.stringify(body.payload ?? {}),
    },
  });

  return NextResponse.json({ section });
}