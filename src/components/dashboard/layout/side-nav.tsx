'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RocketLaunch as RocketLaunchIcon } from '@phosphor-icons/react/dist/ssr/RocketLaunch';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { useNavigation } from '@/contexts/navigation-context';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsNavigating } = useNavigation();
  const [isPending, startTransition] = React.useTransition();

  const handleLogoClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === paths.home) {
        return;
      }
      e.preventDefault();
      setIsNavigating(true);
      startTransition(() => {
        router.push(paths.home);
      });
    },
    [pathname, router, setIsNavigating]
  );

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          component={RouterLink}
          href={paths.home}
          onClick={handleLogoClick}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            ...(isPending && { opacity: 0.7 }),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              bgcolor: 'var(--mui-palette-primary-main)',
              p: 0.75,
            }}
          >
            <RocketLaunchIcon
              fill="var(--mui-palette-primary-contrastText)"
              fontSize="1.5rem"
              weight="fill"
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              background: 'white',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Let&apos;s Go Dashboard
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
     
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const router = useRouter();
  const { setIsNavigating } = useNavigation();
  const [isPending, startTransition] = React.useTransition();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled || external || !href || active) {
        return;
      }

      e.preventDefault();
      setIsNavigating(true);
      
      startTransition(() => {
        router.push(href);
      });
    },
    [disabled, external, href, active, router, setIsNavigating]
  );

  return (
    <li>
      <Box
        {...(href && !external
          ? {
              component: RouterLink,
              href,
              onClick: handleClick,
            }
          : href && external
            ? {
                component: 'a',
                href,
                target: '_blank',
                rel: 'noreferrer',
              }
            : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
          ...(isPending && { opacity: 0.7 }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
