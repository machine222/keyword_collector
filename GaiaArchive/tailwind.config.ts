import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'system-ui', 'sans-serif']
      },
      colors: {
        canvas: {
          DEFAULT: '#f5f5f7',
          subtle: '#fbfbfd'
        },
        ink: {
          DEFAULT: '#1d1d1f',
          muted: '#6e6e73'
        }
      },
      dropShadow: {
        floating: '0 14px 32px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
