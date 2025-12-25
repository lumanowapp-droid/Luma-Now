// Application constants
export const APP_NAME = 'Multi-Platform App';
export const APP_VERSION = '1.0.0';

// API constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';
export const API_TIMEOUT = 10000;

// Feature flags
export const FEATURES = {
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_ANALYTICS: true,
} as const;

// Other constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];