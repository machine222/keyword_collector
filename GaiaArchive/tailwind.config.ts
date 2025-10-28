import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1f2933',
        cloud: '#f8fafc',
        accent: '#0ea5e9'
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
