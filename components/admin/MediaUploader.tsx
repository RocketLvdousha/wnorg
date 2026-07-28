"use client";

/**
 * 媒体选择器：上传本地图/视频 + 粘贴外链
 * 用于 MDX 编辑器插入图片/视频，也用于 cover 字段。
 */
import { useState, useRef } from "react";
import { Upload, Loader2, Link2, X } from "lucide-react";

type Asset = {
  id: string;
  path: string;
  kind: "image" | "video";
  mime: string;
  size: number;
  originalName: string;
};

export function MediaUploader({
  kind, // 限制可上传的类型
  onPick,
  onClose,
}: {
  kind: "image" | "image-or-video";
  onPick: (asset: Asset) => void;
  onClose?: () => void;
}) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setErr(null);
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    setUploading(false);
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error ?? "上传失败");
      return;
    }
    onPick(data.asset);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
  }

  function onPasteUrl() {
    if (!url.trim()) return;
    // 把外链 URL 当作 "asset" 直接传出。path 字段同时承担 src 角色。
    onPick({
      id: "external-" + Date.now(),
      path: url.trim(),
      kind: /\.(mp4|webm|mov)$/i.test(url) ? "video" : "image",
      mime: "",
      size: 0,
      originalName: "外链",
    });
  }

  return (
    <div className="border border-ink-700/20 bg-bone-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("upload")}
            className={`px-3 py-1 text-[11px] tracking-wider ${
              tab === "upload"
                ? "bg-ink-700 text-bone-100"
                : "border border-ink-700/20 text-ink-700"
            }`}
          >
            上传文件
          </button>
          <button
            onClick={() => setTab("url")}
            className={`px-3 py-1 text-[11px] tracking-wider ${
              tab === "url"
                ? "bg-ink-700 text-bone-100"
                : "border border-ink-700/20 text-ink-700"
            }`}
          >
            外链 URL
          </button>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-charcoal/40 hover:text-ink-700">
            <X size={14} />
          </button>
        )}
      </div>

      {tab === "upload" ? (
        <>
          <input
            ref={fileRef}
            type="file"
            accept={
              kind === "image"
                ? "image/jpeg,image/png,image/webp,image/gif,image/avif"
                : "image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
            }
            onChange={onFile}
            className="hidden"
          />
          <button
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 border border-dashed border-ink-700/30 px-4 py-6 text-[12px] text-charcoal/60 hover:border-ink-700/60 hover:text-ink-700 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> 上传中…
              </>
            ) : (
              <>
                <Upload size={14} /> 点击选择文件 ·{" "}
                {kind === "image" ? "图片 ≤ 10MB" : "图片 ≤ 10MB / 视频 ≤ 200MB"}
              </>
            )}
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… 或 /uploads/videos/xxx.mp4"
            className="flex-1 border border-ink-700/20 bg-white px-3 py-2 text-sm text-ink-700"
          />
          <button
            onClick={onPasteUrl}
            className="inline-flex items-center gap-1 bg-ink-700 px-4 py-2 text-[12px] tracking-wider text-bone-100 hover:bg-ink-800"
          >
            <Link2 size={12} /> 使用
          </button>
        </div>
      )}

      {err && <div className="mt-3 text-xs text-red-600">{err}</div>}
    </div>
  );
}