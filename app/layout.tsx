import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/app/components/Providers"; // Import the separated Providers component
import "./globals.css";

// Load the fonts
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

// Metadata
export const metadata: Metadata = {
    title: "Web Scraper",
    description: "Minimal web scraping application",
};

// RootLayout component
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased w-full bg-base-300`}
        >
        <main className="flex flex-col items-center justify-center min-h-screen w-full">
            <Providers>{children}</Providers>
        </main>
        </body>
        </html>
    );
}
