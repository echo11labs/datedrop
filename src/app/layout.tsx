import type { Metadata } from "next";
import { Inter, Nunito, Fredoka } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DateDrop — A Private Invitation",
  description:
    "An immersive, beautifully crafted date invitation. Plan the perfect date and send it as a link.",
  openGraph: {
    title: "DateDrop — You've been invited 💌",
    description:
      "Someone planned something special for you. Tap to find out what.",
    type: "website",
    images: [
      {
        url: "/images/hero-romantic.png",
        width: 1200,
        height: 630,
        alt: "DateDrop — A Private Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DateDrop — You've been invited 💌",
    description:
      "Someone planned something special for you. Tap to find out what.",
    images: ["/images/hero-romantic.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${nunito.variable} ${fredoka.variable} font-sans antialiased scroll-smooth`}
      >
        {children}
      </body>
    </html>
  );
}
