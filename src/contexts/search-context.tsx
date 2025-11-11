'use client';

import * as React from 'react';

interface SearchContextValue {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = React.createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  return <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
