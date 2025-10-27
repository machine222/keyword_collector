import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gaia Archive Studio",
  description: "Minimal editor for curating multimedia memories into NFTs."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
