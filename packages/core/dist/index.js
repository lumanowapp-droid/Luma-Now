"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// src/haptics/platformHaptics.web.ts
var HapticServiceImpl;
var init_platformHaptics_web = __esm({
  "src/haptics/platformHaptics.web.ts"() {
    "use strict";
    HapticServiceImpl = class {
      async trigger(type) {
        return Promise.resolve();
      }
      isAvailable() {
        return false;
      }
      isEnabled() {
        return false;
      }
    };
  }
});

// src/haptics/platformHaptics.ts
var platformHaptics_exports = {};
__export(platformHaptics_exports, {
  HapticServiceImpl: () => HapticServiceImpl
});
var init_platformHaptics = __esm({
  "src/haptics/platformHaptics.ts"() {
    "use strict";
    init_platformHaptics_web();
  }
});

// src/voice/platformVoice.web.ts
var VoiceServiceImpl;
var init_platformVoice_web = __esm({
  "src/voice/platformVoice.web.ts"() {
    "use strict";
    VoiceServiceImpl = class {
      mediaRecorder = null;
      audioChunks = [];
      stream = null;
      async requestPermissions() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
          return true;
        } catch {
          return false;
        }
      }
      async startRecording() {
        this.audioChunks = [];
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: "audio/webm"
        });
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.start();
      }
      async stopRecording() {
        return new Promise((resolve, reject) => {
          if (!this.mediaRecorder) {
            reject(new Error("No active recording"));
            return;
          }
          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
            const uri = URL.createObjectURL(audioBlob);
            this.stream?.getTracks().forEach((track) => track.stop());
            resolve({
              uri,
              duration: 0,
              // Duration not easily available in web
              mimeType: "audio/webm"
            });
          };
          this.mediaRecorder.stop();
        });
      }
      async transcribe(recording) {
        const response = await fetch(recording.uri);
        const audioBlob = await response.blob();
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        const apiResponse = await fetch("/api/transcribe", {
          method: "POST",
          body: formData
        });
        if (!apiResponse.ok) {
          throw new Error("Transcription failed");
        }
        const result = await apiResponse.json();
        return {
          text: result.text,
          confidence: result.confidence,
          language: result.language
        };
      }
      isAvailable() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      }
      isEnabled() {
        return true;
      }
    };
  }
});

// src/voice/platformVoice.ts
var platformVoice_exports = {};
__export(platformVoice_exports, {
  VoiceServiceImpl: () => VoiceServiceImpl
});
var init_platformVoice = __esm({
  "src/voice/platformVoice.ts"() {
    "use strict";
    init_platformVoice_web();
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AuthService: () => AuthService,
  HapticPatterns: () => HapticPatterns,
  HapticService: () => HapticServiceImpl,
  authService: () => authService,
  haptic: () => haptic,
  useHaptic: () => useHaptic,
  useVoiceInput: () => useVoiceInput
});
module.exports = __toCommonJS(src_exports);

// src/authService.ts
var isWeb = typeof window !== "undefined" && typeof document !== "undefined";
var getKeychain = () => {
  if (isWeb && typeof window !== "undefined") {
    return {
      setInternetCredentials: async (service, username, password) => {
        localStorage.setItem(`${service}_${username}`, password);
      },
      getInternetCredentials: async (service) => {
        const password = localStorage.getItem(`${service}_keychain`);
        return password ? { username: "web_user", password } : null;
      },
      resetInternetCredentials: async (service) => {
        localStorage.removeItem(`${service}_keychain`);
      }
    };
  }
  return null;
};
var getLocalAuth = () => {
  if (isWeb && typeof window !== "undefined") {
    return {
      hasHardwareAsync: async () => false,
      isEnrolledAsync: async () => false,
      authenticateAsync: async () => ({ success: false, error: "Not supported on web" })
    };
  }
  return null;
};
var AuthService = class _AuthService {
  static instance;
  keychain = null;
  localAuth = null;
  constructor() {
    this.keychain = getKeychain();
    this.localAuth = getLocalAuth();
  }
  static getInstance() {
    if (!_AuthService.instance) {
      _AuthService.instance = new _AuthService();
    }
    return _AuthService.instance;
  }
  /**
   * Login with email and password
   */
  async login(email, password) {
    try {
      const response = await this.makeAuthRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      const { user, tokens } = response;
      await this.storeTokens(tokens);
      const session = {
        user,
        tokens,
        isAuthenticated: true,
        lastActivity: /* @__PURE__ */ new Date()
      };
      return session;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
  /**
   * Login with biometric authentication
   */
  async biometricLogin() {
    if (!this.localAuth) {
      throw new Error("Biometric authentication not available");
    }
    try {
      const hasHardware = await this.localAuth.hasHardwareAsync();
      if (!hasHardware) {
        throw new Error("Biometric hardware not available");
      }
      const isEnrolled = await this.localAuth.isEnrolledAsync();
      if (!isEnrolled) {
        throw new Error("No biometric data enrolled");
      }
      const result = await this.localAuth.authenticateAsync({
        promptMessage: "Authenticate to access the app",
        fallbackLabel: "Use password",
        cancelLabel: "Cancel"
      });
      if (!result.success) {
        throw new Error("Biometric authentication failed");
      }
      const tokens = await this.getStoredTokens();
      if (!tokens) {
        throw new Error("No stored authentication data");
      }
      const user = await this.getStoredUser();
      if (!user) {
        throw new Error("No stored user data");
      }
      const session = {
        user,
        tokens,
        isAuthenticated: true,
        lastActivity: /* @__PURE__ */ new Date()
      };
      return session;
    } catch (error) {
      throw new Error(`Biometric login failed: ${error.message}`);
    }
  }
  /**
   * Setup biometric authentication
   */
  async setupBiometricAuth() {
    if (!this.localAuth) {
      throw new Error("Biometric authentication not available");
    }
    try {
      const hasHardware = await this.localAuth.hasHardwareAsync();
      if (!hasHardware) {
        throw new Error("Biometric hardware not available");
      }
      const result = await this.localAuth.authenticateAsync({
        promptMessage: "Enable biometric authentication",
        fallbackLabel: "Use password"
      });
      if (result.success) {
        await this.storeBiometricSetup(true);
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Biometric setup failed: ${error.message}`);
    }
  }
  /**
   * Check if biometric authentication is available and enabled
   */
  async isBiometricAvailable() {
    if (!this.localAuth) {
      return false;
    }
    try {
      const hasHardware = await this.localAuth.hasHardwareAsync();
      const isEnrolled = await this.localAuth.isEnrolledAsync();
      const isSetup = await this.isBiometricSetup();
      return hasHardware && isEnrolled && isSetup;
    } catch (error) {
      return false;
    }
  }
  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const currentTokens = await this.getStoredTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error("No refresh token available");
      }
      const response = await this.makeAuthRequest("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken: currentTokens.refreshToken })
      });
      const newTokens = response.tokens;
      await this.storeTokens(newTokens);
      return newTokens;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
  /**
   * Logout user
   */
  async logout() {
    try {
      await this.clearStoredData();
      try {
        await this.makeAuthRequest("/auth/logout", { method: "POST" });
      } catch (error) {
        console.warn("Server logout failed:", error);
      }
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }
  /**
   * Get current authentication session
   */
  async getCurrentSession() {
    try {
      const tokens = await this.getStoredTokens();
      const user = await this.getStoredUser();
      if (!tokens || !user) {
        return null;
      }
      if (/* @__PURE__ */ new Date() >= new Date(tokens.expiresAt)) {
        try {
          const newTokens = await this.refreshToken();
          return {
            user,
            tokens: newTokens,
            isAuthenticated: true,
            lastActivity: /* @__PURE__ */ new Date()
          };
        } catch (error) {
          await this.clearStoredData();
          return null;
        }
      }
      return {
        user,
        tokens,
        isAuthenticated: true,
        lastActivity: /* @__PURE__ */ new Date()
      };
    } catch (error) {
      console.error("Failed to get current session:", error);
      return null;
    }
  }
  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const session = await this.getCurrentSession();
    return session !== null;
  }
  // Private methods
  async makeAuthRequest(endpoint, options) {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(errorData.message || "Authentication request failed");
    }
    return response.json();
  }
  async storeTokens(tokens) {
    try {
      if (this.keychain) {
        await this.keychain.setInternetCredentials(
          "auth_tokens",
          tokens.accessToken,
          tokens.refreshToken
        );
      } else {
        localStorage.setItem("auth_tokens", JSON.stringify(tokens));
      }
    } catch (error) {
      throw new Error(`Failed to store tokens: ${error.message}`);
    }
  }
  async getStoredTokens() {
    try {
      if (this.keychain) {
        const credentials = await this.keychain.getInternetCredentials("auth_tokens");
        if (credentials) {
          return {
            accessToken: credentials.username,
            refreshToken: credentials.password,
            expiresAt: new Date(Date.now() + 36e5),
            // 1 hour
            tokenType: "Bearer"
          };
        }
      } else {
        const stored = localStorage.getItem("auth_tokens");
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error("Failed to retrieve tokens:", error);
    }
    return null;
  }
  async storeUser(user) {
    try {
      if (this.keychain) {
        await this.keychain.setInternetCredentials("user_data", user.id, JSON.stringify(user));
      } else {
        localStorage.setItem("user_data", JSON.stringify(user));
      }
    } catch (error) {
      throw new Error(`Failed to store user data: ${error.message}`);
    }
  }
  async getStoredUser() {
    try {
      if (this.keychain) {
        const credentials = await this.keychain.getInternetCredentials("user_data");
        if (credentials) {
          return JSON.parse(credentials.password);
        }
      } else {
        const stored = localStorage.getItem("user_data");
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
    }
    return null;
  }
  async storeBiometricSetup(enabled) {
    try {
      if (this.keychain) {
        await this.keychain.setInternetCredentials("biometric_setup", "enabled", enabled.toString());
      } else {
        localStorage.setItem("biometric_setup", enabled.toString());
      }
    } catch (error) {
      console.error("Failed to store biometric setup:", error);
    }
  }
  async isBiometricSetup() {
    try {
      if (this.keychain) {
        const credentials = await this.keychain.getInternetCredentials("biometric_setup");
        return credentials && credentials.password === "true";
      } else {
        return localStorage.getItem("biometric_setup") === "true";
      }
    } catch (error) {
      console.error("Failed to check biometric setup:", error);
      return false;
    }
  }
  async clearStoredData() {
    try {
      if (this.keychain) {
        await this.keychain.resetInternetCredentials("auth_tokens");
        await this.keychain.resetInternetCredentials("user_data");
        await this.keychain.resetInternetCredentials("biometric_setup");
      } else {
        localStorage.removeItem("auth_tokens");
        localStorage.removeItem("user_data");
        localStorage.removeItem("biometric_setup");
      }
    } catch (error) {
      console.error("Failed to clear stored data:", error);
    }
  }
};
var authService = AuthService.getInstance();

// src/haptics/index.ts
async function haptic(type) {
  const { HapticServiceImpl: HapticServiceImpl2 } = await Promise.resolve().then(() => (init_platformHaptics(), platformHaptics_exports));
  const service = new HapticServiceImpl2();
  if (!service.isAvailable()) {
    return;
  }
  const enabled = await service.isEnabled();
  if (!enabled) {
    return;
  }
  await service.trigger(type);
}
function useHaptic() {
  return async (type) => {
    await haptic(type);
  };
}
var HapticPatterns = {
  // Button interactions
  buttonPress: () => haptic("medium"),
  buttonLight: () => haptic("light"),
  // Task interactions
  taskComplete: () => haptic("success"),
  taskDelete: () => haptic("warning"),
  // Navigation
  swipe: () => haptic("light"),
  modalDismiss: () => haptic("medium"),
  // State changes
  toggleOn: () => haptic("light"),
  toggleOff: () => haptic("light"),
  // Feedback
  success: () => haptic("success"),
  error: () => haptic("error"),
  warning: () => haptic("warning")
};

// src/voice/index.ts
function useVoiceInput() {
  const [state, setState] = React.useState("idle");
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState(null);
  const recordingRef = React.useRef(null);
  const startRecording = React.useCallback(async () => {
    try {
      setState("recording");
      setError(null);
      const { VoiceServiceImpl: VoiceServiceImpl2 } = await Promise.resolve().then(() => (init_platformVoice(), platformVoice_exports));
      const service = new VoiceServiceImpl2();
      if (!service.isAvailable()) {
        throw new Error("Microphone not available");
      }
      const hasPermission = await service.requestPermissions();
      if (!hasPermission) {
        throw { code: "PERMISSION_DENIED", message: "Microphone permission denied" };
      }
      await service.startRecording();
    } catch (err) {
      setState("error");
      setError(err.code ? err : { code: "RECORDING_FAILED", message: err.message });
    }
  }, []);
  const stopRecording = React.useCallback(async () => {
    try {
      if (state !== "recording")
        return;
      setState("processing");
      const { VoiceServiceImpl: VoiceServiceImpl2 } = await Promise.resolve().then(() => (init_platformVoice(), platformVoice_exports));
      const service = new VoiceServiceImpl2();
      const recording = await service.stopRecording();
      recordingRef.current = recording;
      const result = await service.transcribe(recording);
      setText(result.text);
      setState("idle");
    } catch (err) {
      setState("error");
      setError(
        err.code ? err : { code: "TRANSCRIPTION_FAILED", message: err.message }
      );
    }
  }, [state]);
  const reset = React.useCallback(() => {
    setState("idle");
    setText("");
    setError(null);
    recordingRef.current = null;
  }, []);
  return {
    state,
    text,
    error,
    startRecording,
    stopRecording,
    reset
  };
}

// src/index.ts
init_platformHaptics();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthService,
  HapticPatterns,
  HapticService,
  authService,
  haptic,
  useHaptic,
  useVoiceInput
});
