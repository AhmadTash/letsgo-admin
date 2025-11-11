'use client';

import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps): React.JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

