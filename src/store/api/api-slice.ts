import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, defaultHeaders, getAuthHeaders } from '@/lib/api/config';
import type { User } from '@/types/user';

/**
 * Get the base URL for API requests
 * In development, use the Next.js proxy to avoid CORS issues
 * In production, use direct API URL (or continue using proxy if backend doesn't support CORS)
 */
function getBaseUrl(): string {
  // In development, use the proxy route
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    return '/api/proxy';
  }
  // In production, use the actual API URL
  return API_BASE_URL;
}

/**
 * Base API Slice with RTK Query
 * Handles all API endpoints with automatic caching and invalidation
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      // Set default headers
      Object.entries(defaultHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      // Set auth headers if token exists
      const authHeaders = getAuthHeaders();
      Object.entries(authHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return headers;
    },
  }),
  tagTypes: ['User', 'Auth', 'Students', 'Trainers', 'Jobs', 'Schools'],
  endpoints: () => ({}),
});

