/**
 * GET    /api/admin/home/sections          列出全部首页区块（含不可见）
 * POST   /api/admin/home/sections          新建（一般用于 seed 缺失时补建）
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin-session";

export async function GET() {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const sections = await prisma.homeSection.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ sections });
}

export async function POST(req: Request) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const body = (await req.json()) as {
    type?: string;
    title?: string;
    payload?: unknown;
    visible?: boolean;
  };
  if (!body.type) {
    return NextResponse.json({ error: "缺少 type" }, { status: 400 });
  }
  const last = await prisma.homeSection.findFirst({
    orderBy: { displayOrder: "desc" },
  });
  const order = (last?.displayOrder ?? 0) + 1;

  const section = await prisma.homeSection.create({
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