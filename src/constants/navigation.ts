import { PIXELFED_PROFILE } from "@/constants/config";

export type NavItem = {
  name: string;
  href: string;
  icon?: string;
  external?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Texts", href: "/texts" },
  { name: "Images", href: "/images" },
  { name: "Contact", href: "/contact" },
];

export const footerNavItems = navItems;

/**
 * Pages that exist but are not in the nav, linked only from the footer.
 */
export const legalNavItems: NavItem[] = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Imprint (Impressum)", href: "/impressum" },
];

export const socialLinks: NavItem[] = [
  { name: "GitHub", href: "https://github.com/bastowj", icon: "github" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/julian-bastow", icon: "linkedin" },
  { name: "Pixelfed", href: PIXELFED_PROFILE, icon: "pixelfed" },
];
