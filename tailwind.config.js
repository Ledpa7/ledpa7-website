/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"LINE Seed Sans KR"', '"Noto Sans KR"', 'sans-serif'],
                line: ['"LINE Seed Sans KR"', 'sans-serif'],
                noto: ['"Noto Sans KR"', 'sans-serif'],
                mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
                technical: ['Chakra Petch', 'Orbitron', 'sans-serif'],
            },
            colors: {
                'paper': '#F2F2F2',
                'cool-gray': '#E0E0E0',
                'industrial-obsidian': '#111111',
                'industrial-silver': '#8E9196',
                'industrial-accent': '#3E63DD',
                'brand-black': '#000000',
                'brand-white': '#FFFFFF',
            },
            letterSpacing: {
                'tightest': '-0.05em',
                'industrial': '1em',
                'technical': '0.3em',
            },
            animation: {
                'scan': 'scan 6s linear infinite',
                'assemble': 'assemble 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
                assemble: {
                    '0%': { transform: 'scale(1.1) translateY(20px)', opacity: '0' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
}



