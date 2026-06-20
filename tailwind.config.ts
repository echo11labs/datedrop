import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#0F0A12",
        blush: "#FF4F81",
        rose: "#FF7EB6",
        lavender: "#F3E5F5",
        wine: "#2A0D1C",
        glass: "rgba(255,255,255,.08)"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        button: ["var(--font-poppins)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(255, 79, 129, 0.22)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "romance-radial":
          "radial-gradient(circle at 18% 12%, rgba(255,126,182,.2), transparent 28%), radial-gradient(circle at 86% 18%, rgba(243,229,245,.14), transparent 24%), linear-gradient(135deg, #0F0A12 0%, #1B0C18 46%, #0F0A12 100%)"
      }
    }
  },
  plugins: []
};

export default config;
