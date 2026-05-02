import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#10121C",   /* navy-dark winter base */
          50:  "#1C1F30",
          100: "#161828",
          900: "#080A14",
        },
        slate: {
          hec: "#8A9BAE",
          light: "#B4C2CF",
          dark: "#5A6E82",
        },
        stark: {
          DEFAULT: "#F5F5F0",
          pure: "#FFFFFF",
          muted: "#D4D4CE",
        },
        winter: {
          accent: "#7BB3D4",   // ice blue
          glow:   "#A8CFEA",
        },
        summer: {
          accent: "#D4956A",   // warm amber
          glow:   "#E8B594",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in":       "fadeIn 0.6s ease-out forwards",
        "slide-up":      "slideUp 0.7s ease-out forwards",
        "season-swap":   "seasonSwap 0.4s ease-in-out",
        "infinite-scroll": "infiniteScroll 40s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        seasonSwap: {
          "0%":   { opacity: "0.6", filter: "blur(4px)" },
          "100%": { opacity: "1",   filter: "blur(0px)" },
        },
        infiniteScroll: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        "hec": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
