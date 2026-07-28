import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主底色：米白（卧室调性）
        bone: {
          50: "#FBF8F3",
          100: "#F5F1EA",
          200: "#EDE7DC",
          300: "#E8E4DC",
          400: "#D9D2C5",
        },
        // 重点色：深海蓝（科学、克制）
        ink: {
          50: "#E8EEF4",
          100: "#C2D0DD",
          200: "#7A95AC",
          300: "#4A6781",
          400: "#2E4A6B",
          500: "#1B3A57",
          600: "#102841",
          700: "#0A1929",
          800: "#070F1A",
        },
        // 生命主色：森林绿（替代 moss，更深更冷）
        // 由 moss 系列平滑过渡为 forest，已有 className 无需全局重命名
        forest: {
          50: "#F0F2EB",
          100: "#D4DBC9",
          200: "#B5C3A4",
          300: "#8FA682",
          400: "#6A7E55",
          500: "#4A5D3D",
          600: "#3A4A30",
          700: "#2D3B23",
          800: "#1F2A18",
          900: "#141B0F",
        },
        // 兼容旧类名 moss → 映射为森林色（平滑迁移）
        moss: {
          100: "#D4DBC9",
          300: "#8FA682",
          500: "#4A5D3D",
          700: "#2D3B23",
        },
        // 财富点缀：古铜金
        gold: {
          100: "#E8DCC4",
          300: "#D4BC8E",
          500: "#B8956A",
          700: "#8A6B45",
        },
        // 暖陶土（夕阳、晒过的土墙、木蜡油）
        ember: {
          100: "#EBDDC9",
          300: "#D4B58E",
          500: "#B68A5E",
          700: "#8A5F3D",
        },
        // 中性
        charcoal: "#2A2A2A",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        serif: [
          "ui-serif",
          "Source Han Serif SC",
          "Songti SC",
          "STSong",
          "SimSun",
          "serif",
        ],
        mono: ["ui-monospace", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        "wide-cn": "0.15em",
        "wider-cn": "0.25em",
      },
      backgroundImage: {
        // 亚麻纹理（细微斜纹）
        "linen":
          "repeating-linear-gradient(45deg, rgba(45,59,35,0.018) 0px, rgba(45,59,35,0.018) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(-45deg, rgba(45,59,35,0.012) 0px, rgba(45,59,35,0.012) 1px, transparent 1px, transparent 3px)",
        // 木纹（同心圆年轮感）
        "wood-grain":
          "repeating-radial-gradient(ellipse at 30% 50%, rgba(45,59,35,0.035) 0px, rgba(45,59,35,0.035) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, rgba(45,59,35,0.02) 0px, rgba(45,59,35,0.02) 1px, transparent 1px, transparent 24px)",
        // 树荫（柔和阴影）
        "canopy-light":
          "radial-gradient(ellipse at top, rgba(45,59,35,0.06) 0%, transparent 60%)",
        "canopy-dark":
          "radial-gradient(ellipse at top, rgba(20,27,15,0.4) 0%, transparent 70%)",
      },
      animation: {
        "wave-slow": "wave-slow 8s ease-in-out infinite",
        "drift": "drift 24s linear infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "breeze": "breeze 6s ease-in-out infinite",
      },
      keyframes: {
        "wave-slow": {
          "0%, 100%": { transform: "translateY(0) scaleY(1)" },
          "50%": { transform: "translateY(-6px) scaleY(1.05)" },
        },
        "drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "breeze": {
          "0%, 100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "33%": { transform: "translateX(2px) translateY(-3px) rotate(0.5deg)" },
          "66%": { transform: "translateX(-1px) translateY(2px) rotate(-0.3deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;