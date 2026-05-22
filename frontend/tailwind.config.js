/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",
        secondary: "#f97316",
        success: "#22c55e",
        danger: "#ef4444",
      }
    },
  },
  plugins: [],
}