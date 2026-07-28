"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 产品视频切换器（替换 ProductFeature 中的占位块）
 *
 * 行为：
 *  - 单视频展示；切换时上一支暂停、下一支从头自动播放（muted）
 *  - src 缺失 / 加载失败 / 仍在缓冲 → 显示原 ProductFeature 的渐变 + W 占位
 *  - 控件：左右 chevron + 播放/暂停 + 圆点指示器
 *  - 键盘：tabIndex=0，ArrowLeft / ArrowRight 切换，Space 播放/暂停
 *
 * 视觉：
 *  - 与原占位同框：aspect-[4/3] · bone-100/50/200 渐变 · 四角金点 · ink-700 文字
 *  - caption：左上 0X / 0N · angle（en-mono + en-serif italic）
 *  - 底部：cn-display 中文标签 + en-mono 英文 caption
 *
 * 实拍素材就位后：
 *  把 src 指向 /public/videos/ 下的 mp4 文件即可，无需改组件代码。
 */

type VideoSlide = {
  id: string;
  src: string;
  label: string;
  caption: string;
  angle: string;
};

export function ProductVideo({ videos }: { videos: VideoSlide[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  const current = videos[index];

  // 切换 / 播放状态变化时，让当前视频开始/暂停，其它视频全部暂停
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index) {
        if (isPlaying) {
          el.currentTime = 0;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      } else {
        el.pause();
      }
    });
  }, [index, isPlaying]);

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % videos.length) + videos.length) % videos.length;
      setIndex(next);
      setIsPlaying(true);
    },
    [videos.length]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      togglePlay();
    }
  };

  // 空态保护：没有任何媒体时只显示占位框，避免访问 undefined
  if (videos.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink-700/10 bg-gradient-to-br from-bone-100 via-bone-50 to-bone-200">
        <span className="absolute left-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
        <span className="absolute right-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
        <span className="absolute left-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
        <span className="absolute right-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="en-serif mx-auto mb-3 flex h-20 w-20 items-center justify-center border border-ink-700/15 text-2xl italic text-forest-600">
            W
          </div>
          <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
            暂无媒体
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="video carousel"
      aria-label="产品视频切换"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative aspect-[4/3] w-full overflow-hidden border border-ink-700/10 bg-gradient-to-br from-bone-100 via-bone-50 to-bone-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
    >
      {/* 四角金点装饰（与原占位一致） */}
      <span className="absolute left-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="absolute right-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="absolute left-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="absolute right-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />

      {/* 视频层（同时渲染，用 z-index + opacity 控制显示） */}
      {videos.map((v, i) => (
        <video
          key={v.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={v.src}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() =>
            setReady((m) => ({ ...m, [v.id]: true }))
          }
          onError={() =>
            setReady((m) => ({ ...m, [v.id]: false }))
          }
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        />
      ))}

      {/* 占位 fallback：当前视频未就绪时显示 */}
      {current && !ready[current.id] && (
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
          <div className="en-serif mx-auto mb-3 flex h-20 w-20 items-center justify-center border border-ink-700/15 text-2xl italic text-forest-600">
            W
          </div>
          <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
            Product Video · {current.angle}
          </div>
        </div>
      )}

      {/* 左上角标 */}
      {current && (
        <div className="absolute left-5 top-5 z-20 flex items-baseline gap-2 text-charcoal/55">
          <span className="en-mono text-[10px] uppercase tracking-[0.32em]">
            {current.id} / 0{videos.length}
          </span>
          <span className="en-serif text-[11px] italic">· {current.angle}</span>
        </div>
      )}

      {/* 播放/暂停（顶部右侧） */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "暂停" : "播放"}
        className="absolute right-12 top-3 z-30 inline-flex items-center justify-center border border-ink-700/15 bg-bone-50/80 p-1.5 text-ink-700/70 backdrop-blur-md transition-all hover:border-ink-700/30 hover:text-ink-700"
      >
        {isPlaying ? (
          <Pause size={12} strokeWidth={1.5} />
        ) : (
          <Play size={12} strokeWidth={1.5} />
        )}
      </button>

      {/* 左/右切换按钮 */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="上一个视频"
        className="absolute left-3 top-1/2 z-30 inline-flex -translate-y-1/2 items-center justify-center border border-ink-700/15 bg-bone-50/80 p-2 text-ink-700/70 backdrop-blur-md transition-all hover:border-ink-700/30 hover:text-ink-700"
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="下一个视频"
        className="absolute right-3 top-1/2 z-30 inline-flex -translate-y-1/2 items-center justify-center border border-ink-700/15 bg-bone-50/80 p-2 text-ink-700/70 backdrop-blur-md transition-all hover:border-ink-700/30 hover:text-ink-700"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>

      {/* 底部 caption */}
      <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center gap-1 px-6 text-center">
        <div className="cn-display text-base text-ink-700 md:text-lg">
          {current.label}
        </div>
        <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
          {current.caption}
        </div>
      </div>

      {/* 圆点指示器 */}
      <div
        role="tablist"
        aria-label="选择视频"
        className="absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-2"
      >
        {videos.map((v, i) => {
          const active = i === index;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-current={active ? "true" : undefined}
              aria-label={`跳到第 ${i + 1} 个：${v.label}`}
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
    </div>
  );
}