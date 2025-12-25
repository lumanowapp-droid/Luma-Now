// ../core/src/haptics/platformHaptics.web.ts
var HapticServiceImpl = class {
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

export {
  HapticServiceImpl
};
