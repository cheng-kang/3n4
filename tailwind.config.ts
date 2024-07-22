import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      card: "var(--card-rgb)",
      foreground: "var(--foreground-rgb)",
      background: "var(--background-rgb)",
    },
    extend: {
      colors: {
        card: "var(--card-rgb)",
        foreground: "var(--foreground-rgb)",
        background: "var(--background-rgb)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      aspectRatio: {
        meishi: "3.5 / 2",
      },
      cursor: {
        thinking:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='64' viewport='0 0 100 100' style='fill:black;font-size:32px;'><text y='50%'>☝🏻</text></svg>\"), pointer",
        eyes: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='64' viewport='0 0 100 100' style='fill:black;font-size:32px;'><text y='50%'>👀</text></svg>\"), pointer",
        magic:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='64' viewport='0 0 100 100' style='fill:black;font-size:32px;'><text y='50%'>🪄</text></svg>\"), pointer",
      },
    },
  },
  plugins: [],
};
export default config;
