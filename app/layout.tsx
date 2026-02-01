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
  title: "TRAILBLAZER - แพลตฟอร์มเชื่อมต่อ Twitch",
  description: "เชื่อมต่อและยกระดับประสบการณ์ Twitch ของคุณด้วยเครื่องมือและการเชื่อมต่อที่ทรงพลัง",
};

import { UserProvider } from "@/components/user-context";
import Navbar from "@/components/navbar";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${anuphan.variable} ${kanit.variable} dark`}>
      <body
        className={`font-sans antialiased`}
      >
        <UserProvider>
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
