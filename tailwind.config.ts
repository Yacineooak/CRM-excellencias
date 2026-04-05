import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1440px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        teal: {
          DEFAULT: "#4ab5b8",
          50: "#edfafa",
          100: "#d4f2f2",
          200: "#a9e2e3",
          300: "#7cd3d4",
          400: "#5bc4c5",
          500: "#4ab5b8",
          600: "#2c9598",
          700: "#1f7072",
          800: "#155255",
          900: "#0d3537"
        }
      },
      borderRadius: {
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem"
      },
      boxShadow: {
        soft: "0 24px 60px rgba(11, 18, 23, 0.10)",
        glass: "0 18px 45px rgba(6, 14, 16, 0.18)",
        teal: "0 18px 40px rgba(74, 181, 184, 0.22)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top left, rgba(74,181,184,0.18), transparent 34%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 60%)"
      },
      keyframes: {
        "float-soft": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "float-soft": "float-soft 5s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
