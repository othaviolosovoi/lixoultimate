/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        accent: "#ab8bff",
        light: {
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
        },
        dark: {
          100: "#111827",
          200: "#1F2937",
          300: "#374151",
        },
        secondary: "#FBBF24",
      },
      fontFamily: {
        poppins: ['Poppins-Regular', 'sans-serif'],
        'poppinsBold': ['Poppins-Bold', 'sans-serif'],
        'poppinsBlack': ['Poppins-Black', 'sans-serif'],
        'nunito': ['Nunito-Regular', 'sans-serif'],
        'nunitoBold': ['Nunito-Bold', 'sans-serif'],
        'nunitoBlack': ['Nunito-Black', 'sans-serif'],
        'nunitoLight': ['Nunito-Light', 'sans-serif'],
        'nunitoMedium': ['Nunito-Medium', 'sans-serif']
      },
    },
  },
  plugins: [],
};
