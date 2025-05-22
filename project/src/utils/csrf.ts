/**
 * CSRF Token Utility
 * 
 * This file provides utilities for storing, retrieving, and managing CSRF tokens.
 * The CSRF token is stored in localStorage and included in API requests for security.
 */

// Key for storing the CSRF token in localStorage
const CSRF_TOKEN_KEY = 'jjap_cloud_csrf_token';

/**
 * Store the CSRF token in localStorage
 * @param token The CSRF token to store
 */
export const storeCsrfToken = (token: string): void => {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
};

/**
 * Retrieve the CSRF token from localStorage
 * @returns The stored CSRF token or null if not found
 */
export const getCsrfToken = (): string | null => {
  return localStorage.getItem(CSRF_TOKEN_KEY);
};

/**
 * Clear the stored CSRF token
 */
export const clearCsrfToken = (): void => {
  localStorage.removeItem(CSRF_TOKEN_KEY);
};

/**
 * Check if a request should include the CSRF token
 * @param url The request URL
 * @param method The request method
 * @returns True if the request should include the CSRF token
 */
export const shouldIncludeCsrfToken = (url: string, method: string): boolean => {
  // Only include CSRF token for POST, PUT, DELETE, PATCH methods
  const methodRequiresCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase());
  
  if (!methodRequiresCsrf) {
    return false;
  }
  
  // Exclude specific endpoints from CSRF token requirement
  const isLoginEndpoint = url.includes('/auth/login');
  const isUserCreationEndpoint = url.includes('/users') && method.toUpperCase() === 'POST';
  
  return !(isLoginEndpoint || isUserCreationEndpoint);
};

/**
 * Add CSRF token to request headers if needed
 * @param headers The request headers
 * @param url The request URL
 * @param method The request method
 * @returns Updated headers with CSRF token if needed
 */
export const addCsrfTokenToHeaders = (
  headers: HeadersInit,
  url: string,
  method: string
): HeadersInit => {
  const headersObj = headers instanceof Headers ? headers : new Headers(headers);
  
  if (shouldIncludeCsrfToken(url, method)) {
    const token = getCsrfToken();
    if (token) {
      headersObj.set('X-CSRF-TOKEN', token);
    }
  }
  
  return headersObj;
};