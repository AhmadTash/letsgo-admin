'use client';

import type { User } from '@/types/user';
import { API_BASE_URL } from '@/lib/api/config';
import type { LoginResponse } from '@/store/api/auth-api';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { username, password } = params;

    try {
      // Create form data - API expects username and password as form fields
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      // Use proxy API route in development to avoid CORS issues
      // In production, you can configure the backend to allow CORS or continue using the proxy
      const isDevelopment = process.env.NODE_ENV === 'development';
      const loginUrl = isDevelopment 
        ? '/api/auth/login'  // Use Next.js API route proxy
        : `${API_BASE_URL}/login`;  // Direct API call (requires CORS on backend)

      const response = await fetch(loginUrl, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with boundary for FormData
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.message || 'Invalid credentials' };
      }

      const data: LoginResponse = await response.json();

      // Store the bearer token
      if (data.token?.token) {
        localStorage.setItem('custom-auth-token', data.token.token);
        // Optionally store expiry for token refresh logic
        if (data.token.expiry) {
          localStorage.setItem('custom-auth-token-expiry', data.token.expiry);
        }
      } else {
        return { error: 'No token received from server' };
      }

      // Store the username from the login response
      if (data.username) {
        localStorage.setItem('custom-auth-username', data.username);
      }

      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    // Retrieve username from localStorage
    const username = localStorage.getItem('custom-auth-username');

    return { 
      data: {
        ...user,
        username: username || undefined,
        name: username || user.name,
      }
    };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('custom-auth-token-expiry');
    localStorage.removeItem('custom-auth-username');

    return {};
  }
}

export const authClient = new AuthClient();
