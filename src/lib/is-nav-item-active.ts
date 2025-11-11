import type { NavItemConfig } from '@/types/nav';

export function isNavItemActive({
  disabled,
  external,
  href,
  matcher,
  pathname,
}: Pick<NavItemConfig, 'disabled' | 'external' | 'href' | 'matcher'> & { pathname: string }): boolean {
  if (disabled || !href || external) {
    return false;
  }

  if (matcher) {
    if (matcher.type === 'startsWith') {
      return pathname.startsWith(matcher.href);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }

  // For overview (/dashboard), only match exactly to avoid matching all dashboard sub-paths
  if (href === '/dashboard') {
    return pathname === href;
  }

  // For other items, check for exact match or if pathname is a detail page (starts with href + '/')
  return pathname === href || pathname.startsWith(`${href}/`);
}
