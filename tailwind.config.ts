import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark:     '#141618',
        dark2:    '#1c1f23',
        dark3:    '#22262b',
        dark4:    '#2a2f36',
        slate:    '#3a4149',
        slate2:   '#4a5260',
        yellow:   '#f0e040',
        yellow2:  '#e8d800',
        gray:     '#8a9299',
        gray2:    '#c0c8d0',
        lightbg:  '#f2f3f5',
        textdark: '#1c1f23',
        green:    '#6ee7b7',
      },
      fontFamily: {
        barlow:    ['Barlow', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
