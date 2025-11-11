import { apiSlice } from './api-slice';
import type { User } from '@/types/user';

/**
 * Auth API endpoints
 */
export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface ResetPasswordParams {
  email: string;
}

export interface UpdatePasswordParams {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  type: string;
  username: string;
  token: {
    token: string;
    expiry: string;
  };
}

export interface AuthResponse {
  token?: string;
  user?: User;
  error?: string;
}

export interface UserResponse {
  data?: User | null;
  error?: string;
}

/**
 * Extended API slice with auth endpoints
 */
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Sign up endpoint
    signUp: builder.mutation<AuthResponse, SignUpParams>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Sign in with password endpoint
    signInWithPassword: builder.mutation<LoginResponse, SignInWithPasswordParams>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Sign in with OAuth endpoint
    signInWithOAuth: builder.mutation<AuthResponse, SignInWithOAuthParams>({
      query: (body) => ({
        url: '/auth/oauth',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Reset password endpoint
    resetPassword: builder.mutation<{ message?: string; error?: string }, ResetPasswordParams>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // Update password endpoint
    updatePassword: builder.mutation<{ message?: string; error?: string }, UpdatePasswordParams>({
      query: (body) => ({
        url: '/auth/update-password',
        method: 'POST',
        body,
      }),
    }),

    // Get current user endpoint
    getUser: builder.query<UserResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // Sign out endpoint
    signOut: builder.mutation<{ message?: string; error?: string }, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInWithPasswordMutation,
  useSignInWithOAuthMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useGetUserQuery,
  useSignOutMutation,
} = authApi;

