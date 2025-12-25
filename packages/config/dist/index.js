"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  API_BASE_URL: () => API_BASE_URL,
  API_TIMEOUT: () => API_TIMEOUT,
  APP_NAME: () => APP_NAME,
  APP_VERSION: () => APP_VERSION,
  FEATURES: () => FEATURES,
  MAX_FILE_SIZE: () => MAX_FILE_SIZE,
  SUPPORTED_FILE_TYPES: () => SUPPORTED_FILE_TYPES
});
module.exports = __toCommonJS(src_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  API_BASE_URL,
  API_TIMEOUT,
  APP_NAME,
  APP_VERSION,
  FEATURES,
  MAX_FILE_SIZE,
  SUPPORTED_FILE_TYPES
});
