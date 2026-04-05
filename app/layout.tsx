import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { LogoLoader } from "@/components/brand/logo-loader";
import { Providers } from "@/app/providers";
import "@/app/globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "AgencyOS | Creative Agency Project Management",
  description: "Premium project management and team dispatch workspace for creative agencies.",
  icons: {
    icon: "https://i.imgur.com/pFlN7HD.png",
    shortcut: "https://i.imgur.com/pFlN7HD.png",
    apple: "https://i.imgur.com/pFlN7HD.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${jakarta.variable} ${grotesk.variable}`} lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <LogoLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
