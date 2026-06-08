import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
      },
      colors: {
        stage: {
          unaware: "#64748b", explorer: "#0ea5e9", builder: "#6366f1",
          operator: "#10b981", strategist: "#f59e0b", creator: "#a855f7",
          leader: "#ec4899", legacy: "#eab308",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
