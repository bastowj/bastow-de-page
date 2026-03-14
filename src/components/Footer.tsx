"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNavItems, socialLinks, NavItem } from "@/constants/navigation";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand and Copyright */}
          <div className="footer-section">
            <Link href="/" className="footer-brand-link">
              Bastow.de
            </Link>
            <p className="footer-copyright">
              © {currentYear} Bastow.de. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Navigation</h3>
            <nav className="footer-nav">
              {footerNavItems.map((item: NavItem) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`footer-nav-link ${pathname === item.href ? "font-medium" : "font-normal"}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Connect</h3>
            <div className="footer-social-links">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="footer-bottom">
          <a className="footer-bottom-link" href="/privacy">Privacy Policy</a>
          <a className="footer-bottom-link" href="/impressum">Imprint (Impressum)</a>
          <a className="footer-bottom-link" href="/feed.xml">RSS</a>
        </div>
      </div>
    </footer>
  );
}
