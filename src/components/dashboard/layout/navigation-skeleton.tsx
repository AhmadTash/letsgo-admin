'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { useNavigation } from '@/contexts/navigation-context';

export function NavigationSkeleton(): React.JSX.Element | null {
  const { isNavigating } = useNavigation();

  // Small delay to prevent flash on fast navigations
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => setShowSkeleton(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [isNavigating]);

  if (!isNavigating || !showSkeleton) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 'var(--MainNav-height)',
        left: { lg: 'var(--SideNav-width)', xs: 0 },
        right: 0,
        bottom: 0,
        bgcolor: 'var(--mui-palette-background-default)',
        zIndex: 100,
        overflow: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ py: '64px' }}>
        <Stack spacing={3}>
          {/* Page title skeleton */}
          <Skeleton variant="text" width={200} height={40} />

          {/* Content skeleton - adapts based on common page patterns */}
          <Stack spacing={2}>
            {/* Card/Grid skeleton */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1, maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' } }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1, maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' } }} />
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 1, maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', lg: 'calc(33.333% - 11px)' } }} />
            </Box>

            {/* Table skeleton */}
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1, mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1, mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1, mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1, mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

