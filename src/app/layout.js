import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cultunesia | Platform Budaya Indonesia",
  description:
    "Cultunesia adalah platform interaktif untuk menjelajahi, belajar, dan melestarikan budaya Indonesia dari berbagai provinsi, bahasa daerah, dan tradisi.",
  keywords: [
    "Budaya Indonesia",
    "Cultunesia",
    "Provinsi Indonesia",
    "Bahasa Daerah",
    "Tradisi",
    "Suku",
    "Wisata Budaya",
  ],
  authors: [{ name: "Cultunesia Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
