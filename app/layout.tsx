import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BrandLogo from "./components/BrandLogo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVEnhance Careers",
  description: "Join the CVEnhance team",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 selection:bg-zinc-200">
        <header className="w-full border-b border-zinc-200 bg-white">
          <div className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-1 items-center justify-center sm:justify-start">
              <a href="/" className="group flex items-center outline-none hover:opacity-90 transition-opacity">
                <BrandLogo height={46} />
              </a>
            </div>
            
            <nav className="hidden sm:flex gap-6 text-sm font-semibold text-zinc-500 uppercase tracking-widest">
              <a href="/" className="hover:text-zinc-900 transition-colors">Jobs</a>
              <a href="/admin" className="hover:text-zinc-900 transition-colors">Admin</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 flex flex-col w-full bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
