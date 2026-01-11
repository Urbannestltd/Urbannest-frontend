/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["var(--font-satoshi)", "Helvetica", "Arial", "sans-serif"],
      },
      colors : {
        "border-neutral" : "#767676",
        "border-light" : "#f1f1f1",
        "border-grey" : "#B2B2B2",
        "primary-gold-50" : "#FDFAF3",
        "primary-gold-70" : "#FFF8EB",
        "primary-gold" : "#CFAA67",
        "button-primary" : "#2A3348",
        "button-hover":'#3F4A64',
        "text-neutral" : "#303030",
        "text-disabled" : "#B3B3B3",
        "success-100" : "#EBF9EE",
        "success-300" : "#4EC18B",
        "success-400" : "#34C759",
        "error-100" : "#FFEBEC",
        "error-400" : "#FF383C",


      }
    },
  },
  plugins: [],
}

