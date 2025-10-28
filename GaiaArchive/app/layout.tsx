import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gaia Archive Editor',
  description: 'Minimal editor experience for capturing memories across media.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-cloud text-ink">
      <body className="min-h-screen font-sans antialiased">
        <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
