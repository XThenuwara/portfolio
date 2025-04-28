import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
        colors: {
            background: "var(--background)",
            foreground: "var(--foreground)",
          },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: '1' },
          "70%": { opacity: '1' },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: '0',
          },
        },
      },
    }
  }
};
export default config;
