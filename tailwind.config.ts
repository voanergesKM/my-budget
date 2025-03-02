import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        card: "var(--card-bg)",
        button: "var(--button-bg)",
        "button-hover": "var(--button-hover-bg)",
        "button-text": "var(--button-text)",
      },
    },
  },
  plugins: [],
} satisfies Config;
