/**
 * GET    /api/admin/about/sections/[id]   读取单个区块
 * PUT    /api/admin/about/sections/[id]   更新 payload / title / visible
 * DELETE /api/admin/about/sections/[id]   删除（谨慎：会一并清理前台展示）
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const section = await prisma.aboutSection.findUnique({
    where: { id: params.id },
  });
  if (!section) {
    return NextResponse.json({ error: "区块不存在" }, { status: 404 });
  }
  return NextResponse.json({ section });
}

export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const body = (await req.json()) as {
    payload?: unknown;
    title?: string;
    visible?: boolean;
  };

  const section = await prisma.aboutSection.update({
    where: { id: params.id },
    data: {
      payload: body.payload !== undefined ? JSON.stringify(body.payload) : undefined,
      title: body.title,
      visible: body.visible,
      updatedById: auth.id,
    },
  });

  await writeAudit({
    userId: auth.id,
    action: "update_about_section",
    targetType: "about_section",
    targetId: section.id,
    meta: { type: section.type, visible: section.visible },
  });

  return NextResponse.json({ section });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const section = await prisma.aboutSection.delete({
    where: { id: params.id },
  });

  await writeAudit({
    userId: auth.id,
    action: "delete_about_section",
    targetType: "about_section",
    targetId: section.id,
    meta: { type: section.type },
  });

  return NextResponse.json({ ok: true });
}