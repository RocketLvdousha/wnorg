/**
 * POST /api/admin/media
 * 多部分表单上传图/视频到 /public/uploads/{images|videos}/
 *
 * 表单字段：file
 * 限制：图片 ≤ 10 MB，视频 ≤ 200 MB
 */
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";

export const runtime = "nodejs";
// Next 默认 1MB body；这里图/视频要更大。
export const dynamic = "force-dynamic";

const MAX_IMAGE = Number(process.env.MAX_IMAGE_SIZE ?? 10 * 1024 * 1024);
const MAX_VIDEO = Number(process.env.MAX_VIDEO_SIZE ?? 200 * 1024 * 1024);

const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const VIDEO_MIME = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(req: Request) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "未找到文件" }, { status: 400 });
  }

  const mime = file.type;
  const isImage = IMAGE_MIME.has(mime);
  const isVideo = VIDEO_MIME.has(mime);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: `不支持的文件类型：${mime}` },
      { status: 400 }
    );
  }

  const max = isImage ? MAX_IMAGE : MAX_VIDEO;
  if (file.size > max) {
    return NextResponse.json(
      {
        error: `文件过大：${isImage ? "图" : "视频"} ≤ ${(max / 1024 / 1024).toFixed(0)} MB`,
      },
      { status: 400 }
    );
  }

  const kind = isImage ? "image" : "video";
  const sub = isImage ? "images" : "videos";
  const ext = EXT_BY_MIME[mime] ?? (isImage ? "jpg" : "mp4");

  const random = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${random}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", sub);
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const publicPath = `/uploads/${sub}/${filename}`;

  const asset = await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: file.name,
      mime,
      size: file.size,
      kind,
      path: publicPath,
      uploadedById: auth.id,
    },
  });

  await writeAudit({
    userId: auth.id,
    action: "upload",
    targetType: "media",
    targetId: asset.id,
    meta: { kind, size: file.size, mime },
  });

  return NextResponse.json({
    asset: {
      id: asset.id,
      path: publicPath,
      kind,
      mime,
      size: file.size,
      originalName: file.name,
    },
  });
}

// 给前端编辑器用的"我的媒体库"列表
export async function GET() {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const list = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
  });
  return NextResponse.json({ assets: list });
}