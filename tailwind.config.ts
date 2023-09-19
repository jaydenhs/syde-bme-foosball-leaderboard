import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        silver: "#d6d6d6",
      },
    },
  },
  plugins: [],
} satisfies Config;
