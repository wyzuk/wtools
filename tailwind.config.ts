import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#388bfd",
          500: "#0071e3",
          600: "#005bb5",
          700: "#00478f",
          800: "#003366",
          900: "#002040",
          DEFAULT: "#0071e3",
        },
        macos: {
          canvas: "#f5f5f7",
          card: "#ffffff",
          cardBorder: "#e5e5ea",
          text: "#1d1d1f",
          textSecondary: "#424245",
          textMuted: "#86868b",
          blue: "#0071e3",
          blueHover: "#0077ed",
          trafficRed: "#ff5f56",
          trafficYellow: "#ffbd2e",
          trafficGreen: "#27c93f",
        },
      },
      fontFamily: {
        mono: [
          '"SF Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        macos: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.06)",
        "macos-card": "0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 16px -2px rgba(0, 0, 0, 0.04)",
        "macos-hover": "0 8px 30px -4px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.04)",
        "macos-window": "0 18px 48px -10px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
        "macos-modal": "0 24px 60px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
