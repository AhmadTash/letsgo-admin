/**
 * API Configuration
 * Reads BASE_URL from environment variables
 * 
 * Note: For Next.js client-side access, use NEXT_PUBLIC_BASE_URL
 * If you have BASE_URL in .env, rename it to NEXT_PUBLIC_BASE_URL
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

if (!API_BASE_URL) {
  if (typeof window !== 'undefined') {
    console.warn(
      'NEXT_PUBLIC_BASE_URL is not set in environment variables. ' +
      'Please add NEXT_PUBLIC_BASE_URL=https://letsgo.free.beeceptor.com to your .env file'
    );
  }
}

/**
 * Default headers for API requests
 */
export const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Get authorization header from localStorage token
 */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('custom-auth-token');
  
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

