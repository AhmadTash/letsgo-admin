'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { usePopover } from '@/hooks/use-popover';
import { useSearch } from '@/contexts/search-context';
import { useUser } from '@/hooks/use-user';
import { paths } from '@/paths';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useSearch();
  const { user } = useUser();

  const userPopover = usePopover<HTMLDivElement>();

  // Get user initials or use default icon
  const getUserInitials = React.useMemo((): string | null => {
    const username = typeof user?.username === 'string' ? user.username : null;
    const name = typeof user?.name === 'string' ? user.name : null;
    const email = typeof user?.email === 'string' ? user.email : null;

    if (username && username.length > 0) {
      return username.charAt(0).toUpperCase();
    }
    if (name && name.trim().length > 0) {
      const names = name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (email && email.length > 0) {
      return email.charAt(0).toUpperCase();
    }
    return null;
  }, [user]);

  // Check if current page is a table page
  const isTablePage = React.useMemo(() => {
    return (
      pathname === paths.dashboard.students ||
      pathname === paths.dashboard.trainers ||
      pathname === paths.dashboard.jobs ||
      pathname === paths.dashboard.schools
    );
  }, [pathname]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            {isTablePage ? (
              <OutlinedInput
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search..."
                startAdornment={
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                  </InputAdornment>
                }
                sx={{ maxWidth: '300px', height: '40px' }}
              />
            ) : null}
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              sx={{ cursor: 'pointer' }}
            >
              {getUserInitials || <UserIcon fontSize="var(--icon-fontSize-md)" />}
            </Avatar>
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
