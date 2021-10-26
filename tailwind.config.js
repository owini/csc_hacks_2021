module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Work Sans", "sans-serif"],
      serif: ["Libre Baskerville", "serif"],
      title: ["Conor Lamb Title"],
    },
    extend: {
      colors: {
        brown: "#2F0D0B",
        red: "#9B0F09",
        navy: "#07123B",
        pine: "#183D36",
        beige: {
          light: "#F0ECE6",
          DEFAULT: "#E6DDCF",
          dark: "#D1B697",
        },
        rust: "#BB6940",
        teal: "#22617E",
        emerald: "#2E6051",
      },
      textColor: {
        brown: "#2F0D0B",
        red: "#9B0F09",
        navy: "#07123B",
        pine: "#183D36",
        beige: {
          light: "#F0ECE6",
          DEFAULT: "#E6DDCF",
          dark: "#D1B697",
        },
        rust: "#BB6940",
        teal: "#22617E",
        emerald: "#2E6051",
      },
    },
  },
  variants: {
    extend: {
      fill: ["hover", "focus", "group-hover", "group-focus"],
      stroke: ["hover", "focus", "group-hover", "group-focus"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
