import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cracktheloop.com"),
  title: "CrackTheLoop — Your Invisible Edge in Every Interview",
  description:
    "Stealth AI copilot for technical, behavioral, consulting, and product interviews. Get real-time, invisible AI guidance during any video call — Zoom, Meet, or Teams.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "interview copilot",
    "stealth AI",
    "interview preparation",
    "AI interview assistant",
    "invisible overlay",
  ],
  openGraph: {
    title: "CrackTheLoop — Your Invisible Edge in Every Interview",
    description: "Stealth AI copilot for Zoom, Meet, or Teams calls. Prepare and respond with confidence using live, context-aware structure suggestions.",
    url: "https://cracktheloop.com",
    siteName: "CrackTheLoop",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrackTheLoop Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrackTheLoop — Your Invisible Edge in Every Interview",
    description: "Stealth AI copilot for Zoom, Meet, or Teams calls. Prepare and respond with confidence using live, context-aware structure suggestions.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CrackTheLoop",
    "url": "https://cracktheloop.com",
    "description": "Stealth AI copilot for technical, behavioral, consulting, and product interviews. Get real-time, invisible AI guidance during Zoom, Meet, or Teams video calls.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
