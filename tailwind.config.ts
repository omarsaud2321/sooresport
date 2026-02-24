import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(10 14 22)",
        card: "rgb(15 22 35)",
        border: "rgb(29 40 64)",
        text: "rgb(226 232 240)",
        muted: "rgb(148 163 184)",
        brand: "rgb(37 99 235)" // royal blue
      }
    }
  },
  plugins: []
} satisfies Config;
