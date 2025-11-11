import { apiSlice } from './api-slice';
import type { Student } from '@/types/student';

/**
 * Students API response
 */
export interface StudentsResponse {
  students?: Student[];
  error?: string;
}

/**
 * Extended API slice with students endpoints
 */
export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all students endpoint
    getStudents: builder.query<StudentsResponse, void>({
      query: () => ({
        url: '/students',
        method: 'GET',
      }),
      transformResponse: (response: Student[] | StudentsResponse): StudentsResponse => {
        // If response is already an object with students property, return as is
        if (response && typeof response === 'object' && 'students' in response) {
          return response as StudentsResponse;
        }
        // If response is an array, wrap it in the expected format
        if (Array.isArray(response)) {
          return { students: response };
        }
        // Fallback
        return { students: [] };
      },
      providesTags: ['Students'],
      // Refetch on mount to ensure fresh data after navigation
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useGetStudentsQuery } = studentsApi;

