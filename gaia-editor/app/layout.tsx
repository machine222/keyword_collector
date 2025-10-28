import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gaia Archive Editor',
  description: 'A minimal, multimodal editor for crafting immersive memory NFTs.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-canvas text-primary antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-muted/40 bg-white/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  GA
                </span>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">Gaia Archive Studio</h1>
                  <p className="text-sm text-neutral-500">
                    Capture memories with elegance across media.
                  </p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-500">
                <a className="hover:text-primary transition" href="#editor">
                  Editor
                </a>
                <a className="hover:text-primary transition" href="#ai-insights">
                  Insights
                </a>
                <a className="hover:text-primary transition" href="#uploads">
                  Library
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
