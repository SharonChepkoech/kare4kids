/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                // make sure the entry HTML file is covered
    "./src/**/*.{js,jsx,ts,tsx}",   // make sure it covers all your JS/TS files inside src
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#4F87FF",  // Define your custom colors
        "secondary-blue": "#2F6CE5",
      },
    },
  },
  plugins: [],
}

