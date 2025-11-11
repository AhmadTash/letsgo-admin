/**
 * Redux Store API exports
 * Centralized exports for easy imports throughout the app
 */

// Store and hooks
export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector, useAppStore } from './hooks';

// API slices
export { apiSlice } from './api/api-slice';

// Auth API endpoints and hooks
export {
  useSignUpMutation,
  useSignInWithPasswordMutation,
  useSignInWithOAuthMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useGetUserQuery,
  useSignOutMutation,
} from './api/auth-api';

export type {
  SignUpParams,
  SignInWithPasswordParams,
  SignInWithOAuthParams,
  ResetPasswordParams,
  UpdatePasswordParams,
  AuthResponse,
  UserResponse,
} from './api/auth-api';

// Students API endpoints and hooks
export { useGetStudentsQuery } from './api/students-api';

export type { StudentsResponse } from './api/students-api';

// Trainers API endpoints and hooks
export { useGetTrainersQuery } from './api/trainers-api';

export type { TrainersResponse } from './api/trainers-api';

// Jobs API endpoints and hooks
export { useGetJobsQuery } from './api/jobs-api';

export type { JobsResponse } from './api/jobs-api';

// Schools API endpoints and hooks
export { useGetSchoolsQuery } from './api/schools-api';

export type { SchoolsResponse } from './api/schools-api';