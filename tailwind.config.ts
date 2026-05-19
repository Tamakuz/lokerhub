import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13211a",
        leaf: "#0f8f52",
        cream: "#fff8ed",
      },
    },
  },
  plugins: [],
};

export default config;
