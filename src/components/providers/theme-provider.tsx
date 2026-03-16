"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class" // Crucial: adds 'dark'/'light' class to <html>
      defaultTheme="system" // Uses OS preference as default
      enableSystem // Allows choosing the "system" option
      themes={["light", "dark", "vaporwave"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
