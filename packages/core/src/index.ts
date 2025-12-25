export * from './authService';
export * from './haptics';
export * from './voice';

// Export HapticServiceImpl as HapticService for backward compatibility
export { HapticServiceImpl as HapticService } from './haptics/platformHaptics';