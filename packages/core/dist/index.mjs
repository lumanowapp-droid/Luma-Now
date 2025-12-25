import {
  HapticServiceImpl
} from "./chunk-3OCDR2YC.mjs";

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
  const { HapticServiceImpl: HapticServiceImpl2 } = await import("./platformHaptics-NUCLVRWQ.mjs");
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
      const { VoiceServiceImpl } = await import("./platformVoice-Y6KRGYKS.mjs");
      const service = new VoiceServiceImpl();
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
      const { VoiceServiceImpl } = await import("./platformVoice-Y6KRGYKS.mjs");
      const service = new VoiceServiceImpl();
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
export {
  AuthService,
  HapticPatterns,
  HapticServiceImpl as HapticService,
  authService,
  haptic,
  useHaptic,
  useVoiceInput
};
