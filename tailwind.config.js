/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F0F0F",
          dark: "#0F0F0F",
          soft: "#1C1C1E",
          accent: "#00F5A0",
          surface: "#F2F2F2",
          gray: "#8E8E93",
        }
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        workSans: ["WorkSans", "sans-serif"],
      },
    },
  },
  plugins: [],
}