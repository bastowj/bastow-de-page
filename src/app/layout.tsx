import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import "@fontsource-variable/roboto";
import "@fontsource-variable/roboto-mono";
import "./globals.css";
import { SITE_CONFIG } from "@/constants/config";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    template: "%s - " + SITE_CONFIG.defaultTitle,
    default: SITE_CONFIG.defaultTitle,
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.baseUrl }],
  openGraph: {
    type: "website",
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.defaultTitle,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary",
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE_CONFIG.baseUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning helps avoid React warnings
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <div className="vaporwave-horizon" aria-hidden="true">
            <div className="vaporwave-horizon-sun"></div>
            <div className="vaporwave-horizon-grid"></div>
          </div>
          <div className="layout-shell">
            <Navbar />
            <main id="main-content" className="grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
