import type { Metadata } from "next";
import {DownloadProvider} from "@/contexts/DownloadContext";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Web Scraper",
  description: "Minimal web scraping application",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200`}
      >
      <main className="flex flex-col items-center justify-center min-h-screen w-full p-4">
          <DownloadProvider>
        {children}
          </DownloadProvider>
      </main>
      </body>
      </html>
  );
}