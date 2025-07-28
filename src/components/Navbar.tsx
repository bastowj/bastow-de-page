"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";

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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full py-4 px-8 sm:px-20 flex justify-between items-center border-b border-subtle bg-background text-foreground">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-bold">
          Bastow.de
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`nav-link ${
              pathname === item.href ? "font-medium" : "font-normal"
            }`}
          >
            {item.name}
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          className="nav-button"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={toggleTheme}
          className="nav-button mr-2"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <button
          onClick={toggleMenu}
          className="nav-button"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 right-0 left-0 bg-background border-b border-subtle z-50">
          <div className="flex flex-col p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`py-2 nav-link ${
                  pathname === item.href ? "font-medium" : "font-normal"
                }`}
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
