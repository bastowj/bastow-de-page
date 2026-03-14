"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { navItems, NavItem } from "@/constants/navigation";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@/lib/icons";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-brand">
        <Link href="/" className="nav-brand-link">
          <Image
            src="/avatar.png"
            alt="Julian"
            width={32}
            height={32}
            className="nav-brand-avatar"
          />
          <span className="nav-brand-title">Bastow.de</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="nav-desktop">
        {navItems.map((item: NavItem) => (
          <Link
            key={item.name}
            href={item.href}
            className={`nav-link ${pathname === item.href ? "font-medium" : "font-normal"}`}
          >
            {item.name}
          </Link>
        ))}
        <button onClick={toggleTheme} className="nav-button" aria-label="Toggle theme">
          {theme === "dark" ? (
            <MoonIcon className="nav-theme-icon" />
          ) : (
            <SunIcon className="nav-theme-icon" />
          )}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="nav-mobile-buttons">
        <button onClick={toggleTheme} className="nav-button mr-2" aria-label="Toggle theme">
          {theme === "dark" ? (
            <MoonIcon className="nav-theme-icon" />
          ) : (
            <SunIcon className="nav-theme-icon" />
          )}
        </button>
        <button onClick={toggleMenu} className="nav-button" aria-label="Toggle menu">
          {isMenuOpen ? (
            <XMarkIcon className="nav-theme-icon" />
          ) : (
            <Bars3Icon className="nav-theme-icon" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="nav-mobile-menu">
          <div className="nav-mobile-menu-inner">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-mobile-link ${pathname === item.href ? "font-medium" : "font-normal"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
