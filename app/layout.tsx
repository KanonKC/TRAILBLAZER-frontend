import type { Metadata } from "next";
import { Anuphan, Kanit } from "next/font/google";
import "./globals.css";

const anuphan = Anuphan({
  subsets: ['latin', 'thai'],
  variable: '--font-sans',
});

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: "TRAILBLAZER",
  description: "เชื่อมต่อและยกระดับประสบการณ์ Twitch ของคุณด้วยเครื่องมือและการเชื่อมต่อที่ทรงพลัง",
};

import { UserProvider } from "@/components/user-context";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/landing/footer";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${anuphan.variable} ${kanit.variable} dark`}>
      <body
        className={`font-sans antialiased min-h-screen flex flex-col`}
      >
        <UserProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
