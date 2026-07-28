"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaRef } from "@/lib/home-types";

/**
 * 媒体轮播（图片 + 视频）
 *
 * 行为：
 *  - 单个媒体槽，aspect-[4/3] 不变（不占额外空间）
 *  - 切到图片时暂停所有视频，切到视频时从 0 开始自动播放
 *  - 左右 chevron + 底部圆点指示器切换
 *  - 键盘：ArrowLeft / ArrowRight
 *
 * 视觉：
 *  - 与 ProductVideo 同框：四角金点 + 左上 0X/N + 角标 + 底部 label/caption
 */
export function MediaCarousel({ media }: { media: MediaRef[] }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const fsVideoRef = useRef<HTMLVideoElement | null>(null);
  const current = media[index];
  const total = media.length;

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % total) + total) % total;
      setIndex(next);
    },
    [total]
  );

  // 切换时：上一支视频暂停，新一支视频从头播放
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [index]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "Escape" && fullscreen) {
      e.preventDefault();
      setFullscreen(false);
    }
  }

  function openFullscreen() {
    setFullscreen(true);
  }
  function closeFullscreen() {
    setFullscreen(false);
  }

  // 全屏状态下：Esc 关闭 / 上一项 / 下一项
  function onFsKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      setFullscreen(false);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  }

  // 全屏切换到视频时，从头播放
  useEffect(() => {
    if (fullscreen && current.kind === "video" && fsVideoRef.current) {
      fsVideoRef.current.currentTime = 0;
      fsVideoRef.current.play().catch(() => {});
    }
  }, [fullscreen, index, current.kind]);

  return (
    <div
      role="region"
      aria-roledescription="media carousel"
      aria-label="产品媒体切换"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative aspect-[4/3] w-full overflow-hidden border border-ink-700/10 bg-gradient-to-br from-bone-100 via-bone-50 to-bone-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
    >
      <span className="pointer-events-none absolute left-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="pointer-events-none absolute right-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="pointer-events-none absolute left-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="pointer-events-none absolute right-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />

      {/* 媒体层：所有 media 都渲染，靠 z-index/opacity 控制显示 */}
      {media.map((m, i) => (
        <div
          key={m.id}
          onDoubleClick={i === index ? openFullscreen : undefined}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "z-10 cursor-zoom-in opacity-100" : "z-0 cursor-default opacity-0"
          }`}
        >
          {m.kind === "video" ? (
            <video
              ref={(el) => {
                refs.current[i] = el;
              }}
              src={m.src}
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={m.src}
              alt={m.label || m.caption}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}

      {/* 左上角标 */}
      <div className="absolute left-5 top-5 z-20 flex items-baseline gap-2 text-charcoal/55">
        <span className="en-mono text-[10px] uppercase tracking-[0.32em]">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {current.angle && (
          <span className="en-serif text-[11px] italic">· {current.angle}</span>
        )}
      </div>

      {/* 左 / 右切换按钮 */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="上一个"
            className="absolute left-3 top-1/2 z-30 inline-flex -translate-y-1/2 items-center justify-center border border-ink-700/15 bg-bone-50/80 p-2 text-ink-700/70 backdrop-blur-md transition-all hover:border-ink-700/30 hover:text-ink-700"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="下一个"
            className="absolute right-3 top-1/2 z-30 inline-flex -translate-y-1/2 items-center justify-center border border-ink-700/15 bg-bone-50/80 p-2 text-ink-700/70 backdrop-blur-md transition-all hover:border-ink-700/30 hover:text-ink-700"
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* 全屏放大按钮 */}
      <button
        type="button"
        onClick={openFullscreen}
        aria-label="全屏查看"
        className="absolute right-3 top-3 z-30 inline-flex items-center justify-center border border-ink-700/15 bg-bone-50/80 p-1.5 text-ink-700/70 backdrop-blur-md transition-all hover:border-ink-700/30 hover:text-ink-700"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 4V1h3M11 4V1H8M1 8v3h3M11 8v3H8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 底部 caption */}
      {(current.label || current.caption) && (
        <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center gap-1 px-6 text-center">
          {current.label && (
            <div className="cn-display text-base text-ink-700 md:text-lg">
              {current.label}
            </div>
          )}
          {current.caption && (
            <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
              {current.caption}
            </div>
          )}
        </div>
      )}

      {/* 圆点指示器 */}
      {total > 1 && (
        <div
          role="tablist"
          aria-label="选择媒体"
          className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-2"
        >
          {media.map((m, i) => {
            const active = i === index;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-current={active ? "true" : undefined}
                aria-label={`跳到第 ${i + 1} 个：${m.label || m.caption || "媒体"}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active
                    ? "w-6 bg-gold-500"
                    : "w-1.5 bg-ink-700/30 hover:bg-ink-700/50"
                }`}
              />
            );
          })}
        </div>
      )}

      {/* 全屏遮罩层 */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="媒体全屏查看"
          tabIndex={0}
          onKeyDown={onFsKey}
          onClick={closeFullscreen}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-700/95 backdrop-blur-sm outline-none"
        >
          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(false);
            }}
            aria-label="关闭全屏"
            className="absolute right-4 top-4 z-10 inline-flex items-center justify-center border border-bone-100/30 bg-bone-100/10 p-2 text-bone-100 backdrop-blur-md transition-all hover:border-bone-100/60 hover:bg-bone-100/20"
          >
            <X size={18} strokeWidth={1.5} />
          </button>

          {/* 左 / 右切换 */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(index - 1);
                }}
                aria-label="上一个"
                className="absolute left-6 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center border border-bone-100/30 bg-bone-100/10 p-3 text-bone-100 backdrop-blur-md transition-all hover:border-bone-100/60 hover:bg-bone-100/20"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(index + 1);
                }}
                aria-label="下一个"
                className="absolute right-6 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center border border-bone-100/30 bg-bone-100/10 p-3 text-bone-100 backdrop-blur-md transition-all hover:border-bone-100/60 hover:bg-bone-100/20"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* 媒体本体 */}
          <div
            className="relative flex h-full w-full items-center justify-center px-16 py-16"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={closeFullscreen}
          >
            {current.kind === "video" ? (
              <video
                ref={fsVideoRef}
                src={current.src}
                muted
                loop
                playsInline
                controls
                autoPlay
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.src}
                alt={current.label || current.caption}
                className="max-h-full max-w-full object-contain"
              />
            )}

            {/* 底部 caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 text-center">
              {current.label && (
                <div className="cn-display text-lg text-bone-100">
                  {current.label}
                </div>
              )}
              {current.caption && (
                <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-bone-300/60">
                  {current.caption}
                </div>
              )}
            </div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-6 top-6 en-mono text-[10px] uppercase tracking-[0.32em] text-bone-300/60">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              {current.angle && (
                <span className="en-serif ml-2 italic">· {current.angle}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}