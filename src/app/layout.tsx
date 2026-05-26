import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamSnap",
  description: "TeamSnap sports team management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="sui-h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="sui-min-h-full sui-flex sui-flex-col sui-overflow-visible">{children}</body>
    </html>
  );
}
