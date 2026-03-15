/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        "sidebar-background": "hsl(var(--sidebar-background))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        ecommerce: {
          heading: '#111827',
          text: '#374151',
          placeholder: '#6b7280',
          border: '#d1d5db',
          card: '#ffffff',
          'page-bg': '#f9fafb',
          primary: '#2563eb',
          'primary-hover': '#1d4ed8',
          'nav-icon': '#e5e7eb',
          'nav-icon-hover': '#ffffff',
          badge: '#ef4444',
          'nav-active': '#60a5fa'
        },
        // add any other custom color references as needed
      },

    },
  },
  plugins: [],
}

