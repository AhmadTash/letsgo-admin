import { apiSlice } from './api-slice';
import type { Job } from '@/types/job';

/**
 * Jobs API response
 */
export interface JobsResponse {
  jobs?: Job[];
  error?: string;
}

/**
 * Extended API slice with jobs endpoints
 */
export const jobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all jobs endpoint
    getJobs: builder.query<JobsResponse, void>({
      query: () => ({
        url: '/jobs',
        method: 'GET',
      }),
      transformResponse: (response: Job[] | JobsResponse): JobsResponse => {
        // If response is already an object with jobs property, return as is
        if (response && typeof response === 'object' && 'jobs' in response) {
          return response as JobsResponse;
        }
        // If response is an array, wrap it in the expected format
        if (Array.isArray(response)) {
          return { jobs: response };
        }
        // Fallback
        return { jobs: [] };
      },
      providesTags: ['Jobs'],
      // Refetch on mount to ensure fresh data after navigation
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetJobsQuery } = jobsApi;

