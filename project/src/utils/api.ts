/**
 * API Request Utility
 * 
 * This file provides utilities for making API requests with CSRF token support.
 * Supports both JSON and FormData requests.
 */

import { API_URL } from './env';
import { addCsrfTokenToHeaders, clearCsrfToken } from './csrf';

interface RequestOptions extends RequestInit {
  skipCsrf?: boolean;
}

/**
 * Make an API request with CSRF token support
 * @param endpoint The API endpoint (without the base URL)
 * @param options Request options
 * @returns Promise with the response
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  const method = options.method || 'GET';

  // Prepare headers
  const headers = options.headers || {
    'Content-Type': 'application/json',
    'Origin': window.location.origin,
  };

  // Add CSRF token to headers if needed and not explicitly skipped
  const finalHeaders = !options.skipCsrf 
    ? addCsrfTokenToHeaders(headers, url, method)
    : headers;

  // Prepare request options
  const requestOptions: RequestInit = {
    ...options,
    method,
    headers: finalHeaders,
    credentials: 'include', // Include cookies (JSESSIONID)
    mode: 'cors', // Enable CORS
  };

  // Make the request
  const response = await fetch(url, requestOptions);

  // Check if the response is JSON before parsing
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // Handle non-JSON response (like HTML)
    const text = await response.text();
    console.error('Received non-JSON response:', text);
    throw new Error('서버에서 예상치 못한 응답을 받았습니다. 나중에 다시 시도해주세요.');
  }

  // Handle error responses
  if (!response.ok) {
    // Handle 401 Unauthorized - clear CSRF token
    if (response.status === 401) {
      clearCsrfToken();
    }

    throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.');
  }

  return data as T;
};

/**
 * Login to the application
 * @param email User email
 * @param password User password
 * @returns Promise with the login result
 */
export const login = async (email: string, password: string) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipCsrf: true, // Skip CSRF for login
  });
};

/**
 * Register a new user
 * @param userData User registration data
 * @returns Promise with the registration result
 */
export const register = async (userData: { nickname: string; email: string; password: string }) => {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipCsrf: true, // Skip CSRF for registration
  });
};

/**
 * Fetch the current user's data
 * @returns Promise with the user data
 */
export const fetchCurrentUser = async () => {
  return apiRequest('/users/me');
};

/**
 * Upload a music file with metadata
 * @param musicData The music data and file
 * @returns Promise with the upload result
 */
export const uploadMusic = async (
  formData: FormData
) => {
  const url = `${API_URL}/musics`;
  const method = 'POST';

  // Add CSRF token to headers
  const headers = new Headers({
    'Origin': window.location.origin,
  });

  // Add CSRF token to headers if needed
  const finalHeaders = addCsrfTokenToHeaders(headers, url, method);

  // Make the request
  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: formData,
    credentials: 'include',
    mode: 'cors',
  });

  // Handle non-OK responses
  if (!response.ok) {
    throw new Error('음악 업로드에 실패했습니다.');
  }

  // Try to parse JSON response if available
  try {
    return await response.json();
  } catch (e) {
    // If no JSON response, return success status
    return { success: true };
  }
};
