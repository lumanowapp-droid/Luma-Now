declare const APP_NAME = "Multi-Platform App";
declare const APP_VERSION = "1.0.0";
declare const API_BASE_URL: string;
declare const API_TIMEOUT = 10000;
declare const FEATURES: {
    readonly ENABLE_OFFLINE_MODE: true;
    readonly ENABLE_PUSH_NOTIFICATIONS: false;
    readonly ENABLE_ANALYTICS: true;
};
declare const MAX_FILE_SIZE: number;
declare const SUPPORTED_FILE_TYPES: string[];

export { API_BASE_URL, API_TIMEOUT, APP_NAME, APP_VERSION, FEATURES, MAX_FILE_SIZE, SUPPORTED_FILE_TYPES };
