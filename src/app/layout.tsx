import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap"
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-dancing",
  display: "swap"
});

export const metadata: Metadata = {
  title: "DateDrop — A Private Invitation",
  description: "An immersive, beautifully crafted date invitation. Scroll through worlds to build the perfect moment.",
  openGraph: {
    title: "DateDrop — A Private Invitation",
    description: "Something arrived for you. Scroll to open it.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} ${dancing.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
