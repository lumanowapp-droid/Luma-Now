/**
 * BrainDump Screen
 * Platform-agnostic export - automatically selects web or native implementation
 */

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';

// Import platform-specific implementations
let BrainDumpImpl: any;
let BrainDumpProps: any;

if (isWeb) {
  BrainDumpImpl = require('./BrainDump.web').BrainDump;
  BrainDumpProps = require('./BrainDump').BrainDumpProps;
} else {
  BrainDumpImpl = require('./BrainDump.native').BrainDump;
  BrainDumpProps = require('./BrainDump').BrainDumpProps;
}

export const BrainDump = BrainDumpImpl;
export type { BrainDumpProps };
