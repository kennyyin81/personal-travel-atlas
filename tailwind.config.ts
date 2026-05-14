import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#080b12",
        panel: "rgba(255,255,255,0.08)",
        gold: "#f7d38a",
        cyan: "#7dd3fc"
      },
      boxShadow: {
        glow: "0 0 40px rgba(125, 211, 252, 0.18)",
        gold: "0 0 36px rgba(247, 211, 138, 0.18)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
