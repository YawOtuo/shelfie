/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./lib/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#11964a",
                "primary-dark": "#0e7a3c",
                "primary-light": "#14b85b",
            },
            fontSize: {
                xxs: "10px",
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