"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { navItems, NavItem } from "@/constants/navigation";
import { SunIcon, MoonIcon } from "@/lib/icons";

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

  return (
    <nav className="w-full py-4 px-8 sm:px-20 flex justify-between items-center border-b border-subtle bg-background text-foreground">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-lg font-bold">Bastow.de</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center space-x-8">
        {navItems.map((item: NavItem) => (
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
          {theme === "dark" ? (
            <MoonIcon className="nav-theme-icon" />
          ) : (
            <SunIcon className="nav-theme-icon" />
          )}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={toggleTheme}
          className="nav-button mr-2"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <MoonIcon className="nav-theme-icon" />
          ) : (
            <SunIcon className="nav-theme-icon" />
          )}
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
