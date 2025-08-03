export type NavItem = {
  name: string;
  href: string;
  icon?: string;
  external?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Texts", href: "/texts" },
  { name: "Contact", href: "/contact" },
];

export const footerNavItems = navItems;
