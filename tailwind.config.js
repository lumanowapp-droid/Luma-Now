/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        primary: "#7C8CF8",
        textPrimary: "#111111",
        textSecondary: "#555555"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px"
      }
    }
  },
  plugins: []
}
