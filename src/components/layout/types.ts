export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  hasSubmenu?: boolean;
  items?: { label: string; icon?: string; href: string; active?: boolean }[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
