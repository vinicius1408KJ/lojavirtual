/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dlsports: {
                    green: '#006634',
                    neon: '#B5FF00',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // I'll add Inter font link to html later
            }
        },
    },
    plugins: [],
}
