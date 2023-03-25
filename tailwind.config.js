/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: { xs: { max: "640px" } },
      colors: {
        dark: "#212529",
      },
      maxWidth: {
        '12': '3rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            pre: {
              color: theme("colors.grey.1000"),
              backgroundColor: theme("colors.grey.100"),
              padding: 0,
            },
            "pre code": {
              backgroundColor: theme("colors.black.100"),
              color: "#DD1144",
              fontWeight: "500",
              "border-radius": "0.25rem",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
