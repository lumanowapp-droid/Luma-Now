// src/constants.ts
var APP_NAME = "Multi-Platform App";
var APP_VERSION = "1.0.0";
var API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";
var API_TIMEOUT = 1e4;
var FEATURES = {
  ENABLE_OFFLINE_MODE: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_ANALYTICS: true
};
var MAX_FILE_SIZE = 10 * 1024 * 1024;
var SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export {
  API_BASE_URL,
  API_TIMEOUT,
  APP_NAME,
  APP_VERSION,
  FEATURES,
  MAX_FILE_SIZE,
  SUPPORTED_FILE_TYPES
};
