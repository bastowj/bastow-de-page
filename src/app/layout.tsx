import { ThemeProvider } from "../components/providers/theme-provider";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "bastow.de - %s",
    default: "bastow.de",
  },
  description: "a personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning helps avoid React warnings
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${robotoSans.variable} font-sans ${robotoMono.variable} font-mono`}
      >
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
