/**
 * 树冠剪影背景
 * 替代 WaveBackground —— 从"HRV / 脑电波形"改为"常青林林冠 + 远山轮廓 + 晨光透过树梢"
 * 极慢节奏微动，呼应"森林里的时间"
 */
"use client";

import { motion } from "framer-motion";

export function ForestCanopy({
  tone = "light",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const isDark = tone === "dark";

  // 常青林树冠剪影（由多个三角形拼接成一片起伏的天际线）
  // 远山轮廓（更靠下的柔和曲线）
  // 颜色
  const mountainStroke = isDark ? "rgba(143, 166, 130, 0.18)" : "rgba(74, 93, 61, 0.16)";
  const mountainFill = isDark ? "rgba(143, 166, 130, 0.04)" : "rgba(74, 93, 61, 0.04)";
  const treeStroke = isDark ? "rgba(143, 166, 130, 0.22)" : "rgba(45, 59, 35, 0.18)";
  const treeFill = isDark ? "rgba(143, 166, 130, 0.05)" : "rgba(45, 59, 35, 0.05)";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id={`fog-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={treeStroke} stopOpacity="0" />
            <stop offset="100%" stopColor={treeStroke} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* 远山轮廓（最远的一层，最淡） */}
        <motion.path
          d="M0,520 C200,490 360,510 520,495 C680,478 820,500 960,485 C1080,470 1220,492 1340,485 L1440,485 L1440,800 L0,800 Z"
          fill={mountainFill}
          stroke="none"
          animate={{
            d: [
              "M0,520 C200,490 360,510 520,495 C680,478 820,500 960,485 C1080,470 1220,492 1340,485 L1440,485 L1440,800 L0,800 Z",
              "M0,520 C200,495 360,505 520,500 C680,485 820,495 960,490 C1080,478 1220,485 1340,490 L1440,490 L1440,800 L0,800 Z",
              "M0,520 C200,490 360,510 520,495 C680,478 820,500 960,485 C1080,470 1220,492 1340,485 L1440,485 L1440,800 L0,800 Z",
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 中景：常青林冠（连续起伏的针叶树天际线） */}
        <motion.path
          d="M0,580 L40,560 L80,575 L120,545 L160,565 L200,540 L240,560 L280,535 L320,560 L360,540 L400,555 L440,530 L480,555 L520,540 L560,525 L600,545 L640,535 L680,560 L720,540 L760,525 L800,545 L840,530 L880,555 L920,540 L960,525 L1000,545 L1040,535 L1080,560 L1120,545 L1160,525 L1200,545 L1240,535 L1280,560 L1320,540 L1360,525 L1400,545 L1440,540 L1440,800 L0,800 Z"
          fill={treeFill}
          stroke={treeStroke}
          strokeWidth="0.5"
          animate={{
            d: [
              "M0,580 L40,560 L80,575 L120,545 L160,565 L200,540 L240,560 L280,535 L320,560 L360,540 L400,555 L440,530 L480,555 L520,540 L560,525 L600,545 L640,535 L680,560 L720,540 L760,525 L800,545 L840,530 L880,555 L920,540 L960,525 L1000,545 L1040,535 L1080,560 L1120,545 L1160,525 L1200,545 L1240,535 L1280,560 L1320,540 L1360,525 L1400,545 L1440,540 L1440,800 L0,800 Z",
              "M0,580 L40,565 L80,570 L120,550 L160,560 L200,545 L240,555 L280,540 L320,555 L360,545 L400,550 L440,535 L480,550 L520,545 L560,530 L600,540 L640,540 L680,555 L720,545 L760,530 L800,540 L840,535 L880,550 L920,545 L960,530 L1000,540 L1040,540 L1080,555 L1120,550 L1160,530 L1200,540 L1240,540 L1280,555 L1320,545 L1360,530 L1400,540 L1440,545 L1440,800 L0,800 Z",
              "M0,580 L40,560 L80,575 L120,545 L160,565 L200,540 L240,560 L280,535 L320,560 L360,540 L400,555 L440,530 L480,555 L520,540 L560,525 L600,545 L640,535 L680,560 L720,540 L760,525 L800,545 L840,530 L880,555 L920,540 L960,525 L1000,545 L1040,535 L1080,560 L1120,545 L1160,525 L1200,545 L1240,535 L1280,560 L1320,540 L1360,525 L1400,545 L1440,540 L1440,800 L0,800 Z",
            ],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 晨光透过林冠的柔光（顶部右侧，晨曦从山后升起） */}
        {!isDark && (
          <radialGradient id="morning-light" cx="80%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#D4BC8E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D4BC8E" stopOpacity="0" />
          </radialGradient>
        )}
        <rect width="1440" height="800" fill="url(#morning-light)" />
      </svg>

      {/* 顶部树荫柔光（CSS 叠加，增强晨光感） */}
      <div
        className={
          isDark
            ? "absolute inset-x-0 top-0 h-2/3 bg-canopy-shadow-dark"
            : "absolute inset-x-0 top-0 h-2/3 bg-canopy-shadow"
        }
      />
    </div>
  );
}