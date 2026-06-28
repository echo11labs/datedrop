import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "var(--font-inter)", "sans-serif"],
        display: ["var(--font-fredoka)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-inter)", "monospace"],
      },
      colors: {
        black: "#111111",
        white: "#FFFFFF",
        pastel: {
          green: "#dcfce7",
          yellow: "#fef9c3",
          pink: "#fce7f3",
          blue: "#e0f2fe",
          purple: "#f3e8ff",
          orange: "#ffedd5",
        },
      },
      boxShadow: {
        brutal: "3px 3px 0 #111111",
        "brutal-lg": "6px 6px 0 #111111",
        "brutal-sm": "2px 2px 0 #111111",
      },
    },
  },
  plugins: [],
};

export default config;
