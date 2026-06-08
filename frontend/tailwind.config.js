/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'section-desktop': '120px',
        'section-mobile': '64px',
      },
    },
  },
  plugins: [],
}
