import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Montserrat", "Trebuchet MS", "system-ui", "sans-serif"],
        body: ["Manrope", "Trebuchet MS", "system-ui", "sans-serif"],
      },
      colors: {
        night: "#0c1324",
        aero: "#bfe5ff",
        glass: "rgba(255, 255, 255, 0.1)",
        "glass-strong": "rgba(255, 255, 255, 0.18)",
        accent: "#6ec7ff",
        success: "#3dd68c",
        warning: "#ffb020",
        danger: "#ff6b6b",
        lavender: "#9aa7ff",
      },
      boxShadow: {
        glass: "0 18px 45px rgba(6, 18, 40, 0.35)",
        float: "0 14px 30px rgba(12, 22, 44, 0.25)",
      },
      backdropBlur: {
        glass: "18px",
      },
    },
  },
  plugins: [],
} satisfies Config;
