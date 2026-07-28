"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * 三机制空间可视化组件
 * 用于全站背景 · 首页 hero · 工程页 · 产品页机制场景
 *
 * 三层叠加：
 *  L1 远红外 4-14μm — 从设备中心向外扩散的同心波 (ember/amber)
 *  L2 负氧离子    — 缓慢上升漂移的粒子云 (bone/white)
 *  L3 细胞膜电位  — 横向膜带 + 沿线游走的电位脉冲 (forest)
 *
 * tone: light 用在浅色背景(米白)，dark 用在深色背景(墨蓝)
 * intensity: low/medium/high 决定整体透明度
 * showLabels: 是否显示三组浮动数字标注
 */

// —— 稳定粒子位置（每次渲染位置一致，避免 hydration mismatch） ——
// yZone 可限制纵向分布范围，用于把离子簇集中到画面的"可见区"
//   默认 [0, h]   全屏分布（Hero / 产品舞台 / 工程舞台）
//   全站背景层用 [80, 480] 把离子抬到上半屏，避开暖核 (y=580) 与底部膜带 (y=750)
function generateParticles(
  count: number,
  w: number,
  h: number,
  yZone: [number, number] = [0, h]
) {
  let seed = 19260817;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const [yMin, yMax] = yZone;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rng() * w,
    y: yMin + rng() * (yMax - yMin),
    r: 1 + rng() * 2.4,
    duration: 8 + rng() * 10,
    delay: -rng() * 8,
    driftY: -25 - rng() * 70,
    driftX: (rng() - 0.5) * 25,
    depth: rng(), // 0=远 1=近，决定大小与不透明度
  }));
}

const FIR_PLUMES = [
  // 三股热羽流：从设备位置向上蜿蜒升起
  { d: "M-30,0 C-60,-90 -20,-170 -120,-260", delay: 0, width: 2.2 },
  { d: "M0,0 C-10,-80 12,-170 0,-280", delay: 2.5, width: 2.6 },
  { d: "M30,0 C60,-90 20,-170 120,-260", delay: 5, width: 2.2 },
];

const FIR_HEAT_BANDS = [
  // 横向热浪带，模拟空气受热变形，避开膜带的 y
  { y: 200, amp: 8, dur: 12, delay: 0 },
  { y: 410, amp: 6, dur: 14, delay: 4 },
  { y: 660, amp: 8, dur: 16, delay: 8 },
];

const MEMBRANES = [
  { y: 300, dur: 18, delay: 0 },
  { y: 540, dur: 22, delay: 4 },
  { y: 750, dur: 18, delay: 8 },
];

export function MechanismField({
  tone = "dark",
  intensity = "medium",
  showLabels = false,
  className = "",
  ionYZone,
}: {
  tone?: "dark" | "light";
  intensity?: "low" | "medium" | "high";
  showLabels?: boolean;
  className?: string;
  /**
   * 离子簇纵向分布范围 [yMin, yMax]，单位为 viewBox 像素。
   * 不传则铺满整个 800px 高度（默认行为，用于 Hero / 舞台焦点层）。
   * 传入可把离子集中到画面的"可见区"，
   * 例如全站背景层用 [80, 480]，让离子躲开暖核与膜带。
   */
  ionYZone?: [number, number];
}) {
  const particles = useMemo(
    () => generateParticles(45, 1200, 800, ionYZone),
    [ionYZone]
  );

  const opacityScale =
    intensity === "low" ? 0.45 : intensity === "medium" ? 0.7 : 1;

  // 三机制配色：分别承担"热力 / 电性 / 生命"
  const firColor = tone === "dark" ? "#D4B58E" : "#B68A5E"; // ember 热力
  const ionColor = tone === "dark" ? "#FBF8F3" : "#FFFFFF"; // bone 电性
  const membraneColor =
    tone === "dark" ? "#8FA682" : "#4A5D3D"; // forest 生命
  const labelColor =
    tone === "dark" ? "text-bone-100/55" : "text-ink-700/55";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      style={{ opacity: opacityScale }}
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id={`fir-${tone}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={firColor} stopOpacity="0.55" />
            <stop offset="50%" stopColor={firColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={firColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`ion-${tone}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ionColor} stopOpacity="0.95" />
            <stop offset="55%" stopColor={ionColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={ionColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`mem-${tone}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={membraneColor} stopOpacity="0" />
            <stop offset="20%" stopColor={membraneColor} stopOpacity="0.55" />
            <stop offset="80%" stopColor={membraneColor} stopOpacity="0.55" />
            <stop offset="100%" stopColor={membraneColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ========== L1 · Far Infrared 4–14μm ========== */}
        {/* 热辐射意象：暖核光晕 + 三股上升热羽流 + 横向热浪带 */}
        <g transform="translate(600 580)">
          {/* 暖核光晕（脉动光球） */}
          <circle r={70} fill={`url(#fir-${tone})`}>
            <animate
              attributeName="r"
              values="68;92;68"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.55;0.75;0.55"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          {/* 暖核中心实心点 */}
          <circle r={6} fill={firColor}>
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          {/* 三股热羽流 —— 从中心向上蜿蜒升起的弧线 */}
          {FIR_PLUMES.map((p, i) => (
            <motion.path
              key={`plume-${i}`}
              d={p.d}
              fill="none"
              stroke={firColor}
              strokeWidth={p.width}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, 0.55 - i * 0.04, 0],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </g>

        {/* 横向热浪带 —— 模拟空气受热变形 */}
        <g>
          {FIR_HEAT_BANDS.map((b, i) => (
            <motion.path
              key={`heat-band-${i}`}
              d={`M-50 ${b.y} Q 300 ${b.y - b.amp} 600 ${b.y} T 1250 ${b.y}`}
              fill="none"
              stroke={firColor}
              strokeWidth={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.32, 0] }}
              transition={{
                duration: b.dur,
                repeat: Infinity,
                delay: b.delay,
              }}
            />
          ))}
        </g>

        {/* ========== L2 · Negative Air Ions ========== */}
        {/* 缓慢上升漂移的离子簇 */}
        <g>
          {particles.map((p) => (
            <motion.circle
              key={`ion-${p.id}`}
              cx={p.x}
              cy={p.y}
              r={p.r + p.depth * 1.5}
              fill={`url(#ion-${tone})`}
              animate={{
                cy: [p.y, p.y + p.driftY, p.y],
                cx: [p.x, p.x + p.driftX, p.x],
                opacity: [0, 0.4 + p.depth * 0.4, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        {/* ========== L3 · Membrane Potential ========== */}
        {/* 三条横向膜带 + 沿线游走的电位脉冲 */}
        <g>
          {MEMBRANES.map((m, i) => (
            <g key={`mem-${i}`}>
              {/* 膜带基线（柔性渐变） */}
              <line
                x1={0}
                y1={m.y}
                x2={1200}
                y2={m.y}
                stroke={`url(#mem-${tone})`}
                strokeWidth={1.2}
              />
              {/* 沿线游走的电位脉冲（小亮点） */}
              <motion.circle
                cx={0}
                cy={m.y}
                r={4.5}
                fill={membraneColor}
                initial={{ opacity: 0 }}
                animate={{
                  cx: [-20, 1220],
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: m.dur,
                  repeat: Infinity,
                  delay: m.delay,
                  ease: "easeOut",
                }}
              />
              {/* 反向游走的第二个脉冲，错开半周期 */}
              <motion.circle
                cx={1200}
                cy={m.y}
                r={2.5}
                fill={membraneColor}
                initial={{ opacity: 0 }}
                animate={{
                  cx: [1220, -20],
                  opacity: [0, 0.5, 0.5, 0],
                }}
                transition={{
                  duration: m.dur * 0.85,
                  repeat: Infinity,
                  delay: m.delay + m.dur / 2,
                  ease: "easeOut",
                }}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* ========== 浮动数字标注 ========== */}
      {showLabels && (
        <div className="absolute inset-0">
          {/* 远红外 — 右上 */}
          <div
            className={`absolute right-12 top-[28%] text-right ${labelColor} hidden md:block`}
          >
            <div className="en-mono mb-1 text-[9px] uppercase tracking-[0.32em]">
              Far Infrared
            </div>
            <div className="cn-display text-base md:text-lg">4–14 μm</div>
            <div className="en-serif text-[11px] italic opacity-70">
              life light wave
            </div>
          </div>

          {/* 负氧离子 — 垂直中上 · 水平居中 */}
          <div
            className={`absolute left-1/2 top-[28%] -translate-x-1/2 text-center ${labelColor} hidden md:block`}
          >
            <div className="en-mono mb-1 text-[9px] uppercase tracking-[0.32em]">
              Negative Air Ions
            </div>
            <div className="cn-display text-base md:text-lg md:text-xl">
              O<sub>2</sub>
              <sup className="text-[0.6em]">−</sup> · (H<sub>2</sub>O)<sub>n</sub>
            </div>
            <div className="en-serif text-[11px] italic opacity-70">
              hydrated cluster · ≥ 5×10⁶ / cm³
            </div>
          </div>

          {/* 膜电位 — 底部 */}
          <div
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 text-center ${labelColor} hidden md:block`}
          >
            <div className="en-mono mb-1 text-[9px] uppercase tracking-[0.32em]">
              Membrane Potential
            </div>
            <div className="cn-display text-base md:text-lg">0.5–3 Hz</div>
            <div className="en-serif text-[11px] italic opacity-70">
              ultra-low frequency pulse
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
