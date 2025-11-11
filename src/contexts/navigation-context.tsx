'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextValue {
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
}

const NavigationContext = React.createContext<NavigationContextValue | undefined>(undefined);

export interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps): React.JSX.Element {
  const [isNavigating, setIsNavigating] = React.useState<boolean>(false);
  const pathname = usePathname();
  const prevPathnameRef = React.useRef<string>(pathname);

  // Reset navigation state when pathname changes
  React.useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setIsNavigating(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const context = React.useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

