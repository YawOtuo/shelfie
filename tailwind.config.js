/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./lib/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontSize: {
                xxs: "0.625rem",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-out",
            },
            screens: {
                '3xl': '1920px',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                green1: "#0FA958",
                green2: "#97b0a319",
                green3: "#0fa95814",
                greendeep: "#048D45",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                bsecondary: {
                    100: "#A57F60",
                    300: "#967D69",
                    400: "#F5E8D9",
                    500: "#A98743",
                    600: "#25291C",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "#11964a",
                    foreground: "hsl(var(--primary-foreground))",
                    100: "#e8fcf1",
                    200: "#D7EDE1",
                    300: "#8cf2b8",
                    400: "#5fed9c",
                    500: "#31e87f",
                    600: "#17ce66",
                    700: "#12a04f",
                    800: "#0d7338",
                    900: "#084522",
                    1000: "#03170b",
                },
                "primary-dark": "#0e7a3c",
                "primary-light": "#14b85b",
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                tertiary: {
                    DEFAULT: "#f59e0b",
                    foreground: "#ffffff",
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                    900: "#78350f",
                    950: "#451a03",
                },
                shade: {
                    300: "#707070",
                    200: "#F3FCF7",
                    100: "#F3FCF7",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                low: "var(--shadow-elevation-low)",
                medium: "var(--shadow-elevation-medium)",
                high: "var(--shadow-elevation-high)",
            },
            fontFamily: {
                sans: ["Poppins_400Regular", "system-ui"],
                medium: ["Poppins_500Medium", "system-ui"],
                semibold: ["Poppins_600SemiBold", "system-ui"],
                bold: ["Poppins_700Bold", "system-ui"],
            },
        },
    },
    plugins: [],
};