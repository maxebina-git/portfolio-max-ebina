export default {
    content: [
      "./index.html",
      "./src/**/*.{astro,js,ts,jsx,tsx}",
    ],
  
    theme: {
      extend: {
        colors: {
          background: "var(--color-background)",
          foreground: "var(--color-foreground)",
          muted: "var(--color-muted)",
        },
      },
    },
  
    plugins: [],
  };