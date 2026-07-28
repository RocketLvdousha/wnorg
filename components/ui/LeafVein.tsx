/**
 * 叶脉装饰
 * 替代 NeuronLine —— 把神经突触的「冰冷科学」改成「有机生命」的叶脉网络
 * 节点的呼吸感保留，呼应"系统在持续工作"但更有机
 */
"use client";

import { motion } from "framer-motion";

export function LeafVein({
  tone = "light",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const stroke = tone === "dark" ? "rgba(143, 166, 130, 0.35)" : "rgba(74, 93, 61, 0.28)";
  const nodeColor = tone === "dark" ? "#8FA682" : "#4A5D3D";

  // 主叶脉节点 + 子叶脉分支（模拟一片大叶的骨架）
  const nodes = [
    { x: 100, y: 140 },
    { x: 240, y: 130 },
    { x: 380, y: 110 },
    { x: 520, y: 125 },
    { x: 660, y: 105 },
    { x: 820, y: 130 },
    { x: 960, y: 100 },
    { x: 1100, y: 120 },
    { x: 1240, y: 95 },
    { x: 1340, y: 130 },
    // 子节点（叶脉分叉）
    { x: 200, y: 60 },
    { x: 340, y: 200 },
    { x: 480, y: 50 },
    { x: 600, y: 215 },
    { x: 760, y: 55 },
    { x: 900, y: 200 },
    { x: 1040, y: 60 },
    { x: 1180, y: 215 },
  ];

  // 主脉（横向叶脊）
  const mainVeins = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
  ];

  // 侧脉（叶脉分支向两侧展开）
  const sideVeins: [number, number][] = [
    [1, 10],
    [2, 10],
    [2, 11],
    [3, 12],
    [4, 13],
    [5, 14],
    [6, 15],
    [7, 16],
    [8, 17],
  ];

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
      >
        {/* 主脉 */}
        {mainVeins.map(([a, b], i) => (
          <motion.line
            key={`m-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={stroke}
            strokeWidth="0.9"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.08, ease: "easeOut" }}
          />
        ))}
        {/* 侧脉（更细） */}
        {sideVeins.map(([a, b], i) => (
          <motion.line
            key={`s-${i}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={stroke}
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.06, ease: "easeOut" }}
          />
        ))}
        {/* 节点（呼吸感） */}
        {nodes.map((n, i) => (
          <motion.circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={i < 10 ? "2.5" : "1.5"}
            fill={nodeColor}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 0.9, 0.55],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.05,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}