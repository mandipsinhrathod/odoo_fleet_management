/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7bc9fc',
                    400: '#36aef8',
                    500: '#0c8fec',
                    600: '#0070cb',
                    700: '#0258a3',
                    800: '#064b88',
                    900: '#0c4a89', // Main Dark Blue
                    950: '#08305c',
                },
                accent: {
                    400: '#fd7e31',
                    500: '#fc6204', // Main Orange
                    600: '#ea4f02',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'floating': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [],
}
