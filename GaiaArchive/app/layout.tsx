import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/layout/providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Gaia Archive Studio',
  description: 'Capture living memories as on-chain artifacts through a minimal, multi-modal editor.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="bg-canvas-subtle" lang="ko">
      <body className={`${inter.className} bg-canvas-subtle text-ink`}> 
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
