"use client";

/**
 * MDX 编辑器包装（基于 @uiw/react-md-editor）
 * - 自定义工具栏：插入图片 / 插入视频
 * - 800px 高，左右分栏
 * - 上传通过 /api/admin/media，返回 URL 后插入 markdown
 */
import { useState } from "react";
import dynamic from "next/dynamic";
import { Image as ImageIcon, Video } from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import "@uiw/react-md-editor/markdown-editor.css";

// 仅客户端渲染
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function MdxEditor({
  value,
  onChange,
  height = 600,
}: {
  value: string;
  onChange: (v: string) => void;
  height?: number;
}) {
  const [inserting, setInserting] = useState<"image" | "video" | null>(null);

  function insertImage(url: string, alt = "") {
    const md = `![${alt}](${url})`;
    onChange((value || "") + (value ? "\n\n" : "") + md);
    setInserting(null);
  }

  function insertVideo(url: string) {
    // 用 HTML5 video 标签（react-markdown 支持 raw HTML 需 rehype-raw；
    // 简化方案：用 markdown 链接提示是视频，前台用统一渲染器解析）
    const md = `\n\n[video](${url})\n\n`;
    onChange((value || "") + md);
    setInserting(null);
  }

  return (
    <div className="border border-ink-700/20 bg-white">
      {/* 自定义工具条 */}
      <div className="flex items-center gap-2 border-b border-ink-700/10 bg-bone-50 px-3 py-2">
        <button
          type="button"
          onClick={() => setInserting("image")}
          className="inline-flex items-center gap-1 border border-ink-700/20 bg-white px-3 py-1 text-[11px] text-ink-700 hover:bg-bone-100"
        >
          <ImageIcon size={12} /> 插入图片
        </button>
        <button
          type="button"
          onClick={() => setInserting("video")}
          className="inline-flex items-center gap-1 border border-ink-700/20 bg-white px-3 py-1 text-[11px] text-ink-700 hover:bg-bone-100"
        >
          <Video size={12} /> 插入视频
        </button>
        <span className="ml-2 text-[10px] text-charcoal/40">
          支持 Markdown · 图片/视频上传后会自动插入
        </span>
      </div>

      {inserting && (
        <div className="border-b border-ink-700/10 bg-bone-50 px-3 py-3">
          <MediaUploader
            kind={inserting === "image" ? "image" : "image-or-video"}
            onPick={(asset) =>
              inserting === "image"
                ? insertImage(asset.path, asset.originalName)
                : insertVideo(asset.path)
            }
            onClose={() => setInserting(null)}
          />
        </div>
      )}

      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={height}
        preview="live"
        data-color-mode="light"
        textareaProps={{ placeholder: "正文 Markdown …" }}
      />
    </div>
  );
}