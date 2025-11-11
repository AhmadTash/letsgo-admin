import { apiSlice } from './api-slice';
import type { Trainer } from '@/types/trainer';

/**
 * Trainers API response
 */
export interface TrainersResponse {
  trainers?: Trainer[];
  error?: string;
}

/**
 * Extended API slice with trainers endpoints
 */
export const trainersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all trainers endpoint
    getTrainers: builder.query<TrainersResponse, void>({
      query: () => ({
        url: '/trainers',
        method: 'GET',
      }),
      transformResponse: (response: Trainer[] | TrainersResponse): TrainersResponse => {
        // If response is already an object with trainers property, return as is
        if (response && typeof response === 'object' && 'trainers' in response) {
          return response as TrainersResponse;
        }
        // If response is an array, wrap it in the expected format
        if (Array.isArray(response)) {
          return { trainers: response };
        }
        // Fallback
        return { trainers: [] };
      },
      providesTags: ['Trainers'],
      // Refetch on mount to ensure fresh data after navigation
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetTrainersQuery } = trainersApi;