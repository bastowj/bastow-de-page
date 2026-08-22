"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { navItems, type NavItem } from "@/constants/navigation";
import { isRouteActive } from "@/lib/utils";
import {
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
} from "@/lib/icons";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Cycle on resolvedTheme, not theme: with defaultTheme="system" the latter is
  // "system" until the user picks one, so the first click always jumped to light
  // regardless of what was actually on screen.
  const toggleTheme = () => {
    if (resolvedTheme === "light") setTheme("dark");
    else if (resolvedTheme === "dark") setTheme("vaporwave");
    else setTheme("light");
  };

  // Render SunIcon during SSR/hydration to avoid mismatch, then swap after mount
  const ThemeIcon = !mounted
    ? SunIcon
    : resolvedTheme === "dark"
      ? MoonIcon
      : resolvedTheme === "vaporwave"
        ? GlobeAltIcon
        : SunIcon;

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
    <nav className="nav" aria-label="Primary navigation">
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
        {navItems.map((item: NavItem) => {
          const isActive = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive ? "font-medium" : "font-normal"}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={toggleTheme}
          className="nav-button"
          aria-label="Toggle theme"
        >
          <ThemeIcon className="nav-theme-icon" />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="nav-mobile-buttons">
        <button
          onClick={toggleTheme}
          className="nav-button mr-2"
          aria-label="Toggle theme"
        >
          <ThemeIcon className="nav-theme-icon" />
        </button>
        <button
          onClick={toggleMenu}
          className="nav-button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className="nav-theme-icon" />
          ) : (
            <Bars3Icon className="nav-theme-icon" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-navigation-menu" className="nav-mobile-menu">
          <div className="nav-mobile-menu-inner">
            {navItems.map((item) => {
              const isActive = isRouteActive(pathname, item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-mobile-link ${isActive ? "font-medium" : "font-normal"}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
