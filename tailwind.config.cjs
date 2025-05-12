module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FB923C', // Warm Orange
        },
        background: {
          DEFAULT: '#F9FAFB', // Light Neutral Gray
        },
        text: {
          primary: '#1F2937', // Dark Charcoal
          muted: '#6B7280', // Cool Gray
        },
        accent: {
          DEFAULT: '#14B8A6', // Soft Teal
        },
        error: {
          DEFAULT: '#F43F5E', // Rose Red
        },
        success: {
          DEFAULT: '#10B981', // Emerald Green
        },
      },
    },
  },
  plugins: [],
};