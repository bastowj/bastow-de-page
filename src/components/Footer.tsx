"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const footerNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: "github" },
    { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  ];

  return (
    <footer className="w-full py-8 px-8 sm:px-20 mt-auto border-t border-subtle bg-background text-foreground">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Copyright */}
          <div className="flex flex-col">
            <Link href="/" className="text-lg font-bold mb-4">
              Bastow.de
            </Link>
            <p className="text-sm opacity-70">
              © {currentYear} Bastow.de. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-4">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              {footerNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm nav-link ${
                    pathname === item.href ? "font-medium" : "font-normal"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-button"
                  aria-label={link.name}
                >
                  {/* Simple text representation of icons */}
                  {link.icon === "github" && "GH"}
                  {link.icon === "twitter" && "TW"}
                  {link.icon === "linkedin" && "LI"}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-8 pt-8 border-t border-subtle flex flex-wrap gap-6 justify-center md:justify-start">
          <a
            className="text-sm nav-link"
            href="/privacy"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm nav-link"
            href="/terms"
          >
            Terms of Service
          </a>
          <a
            className="text-sm nav-link"
            href="/cookies"
          >
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
}