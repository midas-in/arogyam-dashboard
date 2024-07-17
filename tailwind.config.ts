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
        success: '#24A148',
        primary: {
          10: '#F5F8FF',
          300: '#0F62FE',
          400: '#0075EB',
        },
        gray: {
          3: '#2F363D1C',
          25: '#F6F6F6',
          100: '#DBDADA',
          200: '#C9C8C8',
          400: '#A5A3A3',
          600: '#636262',
          900: '#101010',
        }
      }
    },
  },
  plugins: [],
};
export default config;
