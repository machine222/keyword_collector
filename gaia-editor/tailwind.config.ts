import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx,css}'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f5f7',
        primary: '#0b0b0d',
        accent: '#007aff',
        muted: '#d2d2d7'
      }
    }
  },
  plugins: []
};

export default config;
