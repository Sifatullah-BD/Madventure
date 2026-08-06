/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#2563EB',
            DEFAULT: '#2563EB',
          },
          secondary: "var(--secondary)",
          
          background: {
            DEFAULT: "var(--bg-color)",
            light: "#f9fafb",
            dark: "#0f172a",
          },
  
          surface: {
            DEFAULT: "var(--surface-color)",
            light: "#ffffff",
            dark: "#1e293b",
          },
          
          soft: {
            DEFAULT: "var(--soft-color)",
            light: "#f3f4f6",
            dark: "#334155",
          },
  
          border: {
              DEFAULT: "var(--border-color)",
              light: "#e5e7eb",
              dark: "#475569"
          },
  
          text: {
            primary: "var(--text-primary)",
            secondary: "var(--text-secondary)",
            muted: "var(--text-muted)",
          },
          
          status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6'
          },
          
          forest: {
             light: "#1B5E20",
             dark: "#052e16",
          },
          
          action: '#FF9800', // Alert
        },
        fontFamily: {
          sans: ['Lato', 'sans-serif'],
          heading: ['Poppins', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }
