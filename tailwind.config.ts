import type { Config } from "tailwindcss";

// NOTE: Tailwind v4 is CSS-first — the source of truth for design tokens is the
// `@theme` block in src/app/globals.css. This file is kept in sync purely for
// editor tooling/documentation; it is not loaded via an `@config` directive.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Single brand hue: blue. Everything in the product — primary actions,
        // status badges, ratings, links — draws from this one scale.
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
          surface: "#EFF6FF",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#F1F5F9",
          border: "#E2E8F0",
          "border-strong": "#CBD5E1",
        },
        charcoal: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(15, 23, 42, 0.05)",
        card: "0 2px 6px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
