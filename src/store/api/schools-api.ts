import { apiSlice } from './api-slice';
import type { School } from '@/types/school';

/**
 * Schools API response
 */
export interface SchoolsResponse {
  schools?: School[];
  error?: string;
}

/**
 * Extended API slice with schools endpoints
 */
export const schoolsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all schools endpoint
    getSchools: builder.query<SchoolsResponse, void>({
      query: () => ({
        url: '/schools',
        method: 'GET',
      }),
      transformResponse: (response: School[] | SchoolsResponse): SchoolsResponse => {
        // If response is already an object with schools property, return as is
        if (response && typeof response === 'object' && 'schools' in response) {
          return response as SchoolsResponse;
        }
        // If response is an array, wrap it in the expected format
        if (Array.isArray(response)) {
          return { schools: response };
        }
        // Fallback
        return { schools: [] };
      },
      providesTags: ['Schools'],
      // Refetch on mount to ensure fresh data after navigation
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetSchoolsQuery } = schoolsApi;

