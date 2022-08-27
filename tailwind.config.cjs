/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: true,
  important: true,
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "light",
  },
};
