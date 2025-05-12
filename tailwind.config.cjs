module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {      colors: {
        primary: {
          DEFAULT: '#FF7A00', // Brand Orange
          hover: '#E86D00', // Darker Orange for hover states
          light: '#FFA149', // Lighter Orange
        },
        background: {
          DEFAULT: '#F9FAFB', // Light Neutral Gray
        },
        text: {
          primary: '#1F2937', // Dark Charcoal
          muted: '#6B7280', // Cool Gray
        },
        accent: {
          DEFAULT: '#FF7A00', // Same as primary for consistency
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