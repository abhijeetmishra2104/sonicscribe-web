// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import {
  Inter,
  Poppins,
  Source_Sans_3,
  Source_Serif_4,
} from "next/font/google";
import { Providers } from "./provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
  variable: "--font-source-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "400", "600", "700", "900"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: "SonicScribe AI",
  description: "Intelligence that Listens. Precision that Heals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${sourceSans.variable} ${sourceSerif.variable}`}
    >
      <body className="antialiased bg-background text-foreground font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
