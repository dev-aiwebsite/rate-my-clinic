import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        appblue: {
          200: "#E9F5FF",
          300: "#94BDE5",
          350: "#80b0e0",
          400: "#004261",
        },
      },
    },
  },
  plugins: [],
  "safelist": [
    "row-start-1",
    "row-start-2",
    "row-start-3",
    "row-start-4",
    "row-start-5",
    "row-start-6",
    "row-start-7",
    "row-start-8",
    "row-start-9",
    "row-start-10",
  ],
};
export default config;
