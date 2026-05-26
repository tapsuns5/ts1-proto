export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  hasSubmenu?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
