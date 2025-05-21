/**
 * Environment variables utility
 * 
 * This file centralizes access to environment variables and provides
 * type safety and default values.
 * 
 * Note: In Create React App, environment variables are embedded at build time,
 * not runtime. They must be prefixed with REACT_APP_ to be accessible.
 */

// API URL with fallback to localhost if not defined
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Current environment (development, production, etc.)
export const ENV = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

// Check if we're in development mode
export const IS_DEV = ENV === 'development';

// Check if we're in production mode
export const IS_PROD = ENV === 'production';

// Debug mode (only in development)
export const DEBUG = process.env.REACT_APP_DEBUG === 'true' || (IS_DEV && process.env.NODE_ENV === 'development');

// Log environment variables during development to help with debugging
if (IS_DEV) {
  console.log('Environment Variables:');
  console.log('- API_URL:', API_URL);
  console.log('- ENV:', ENV);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- DEBUG:', DEBUG);
}

// Export all environment variables in a single object
export const env = {
  API_URL,
  ENV,
  IS_DEV,
  IS_PROD,
  DEBUG,
};

export default env;
