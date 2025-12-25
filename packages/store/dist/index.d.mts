import * as _multi_platform_app_types from '@multi-platform-app/types';
import { Task, CapacityLevel, LumaUserSettings } from '@multi-platform-app/types';
export { CapacityLevel, LumaUserSettings, Task, TaskCategory } from '@multi-platform-app/types';
import * as immer from 'immer';
import * as zustand from 'zustand';

interface BrainDumpState {
    text: string;
    isProcessing: boolean;
}
interface BrainDumpActions {
    setText: (text: string) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    compress: () => Promise<void>;
    reset: () => void;
}
type BrainDumpSlice = BrainDumpState & BrainDumpActions;
interface TasksState {
    tasks: Task[];
}
interface TasksActions {
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
    addTasks: (tasks: Omit<Task, 'id' | 'createdAt' | 'order'>[]) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    clearCompleted: () => void;
    reorderTasks: (taskIds: string[]) => void;
}
type TasksSlice = TasksState & TasksActions;
interface CapacityState {
    currentCapacity: CapacityLevel;
    maxTasks: number;
}
interface CapacityActions {
    setCapacity: (level: CapacityLevel) => void;
    getMaxTasksForCapacity: (level: CapacityLevel) => number;
}
type CapacitySlice = CapacityState & CapacityActions;
interface FocusState {
    currentTaskId: string | null;
    elapsedTime: number;
    isActive: boolean;
}
interface FocusActions {
    startFocus: (taskId: string) => void;
    endFocus: () => void;
    updateElapsedTime: (seconds: number) => void;
}
type FocusSlice = FocusState & FocusActions;
interface UIState {
    currentView: 'brain-dump' | 'timeline' | 'focus';
    modalOpen: string | null;
}
interface UIActions {
    setCurrentView: (view: 'brain-dump' | 'timeline' | 'focus') => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}
type UISlice = UIState & UIActions;
interface SettingsState {
    settings: LumaUserSettings;
}
interface SettingsActions {
    updateSettings: (updates: Partial<LumaUserSettings>) => void;
    resetSettings: () => void;
}
type SettingsSlice = SettingsState & SettingsActions;
interface LumaStore extends BrainDumpSlice, TasksSlice, CapacitySlice, FocusSlice, UISlice, SettingsSlice {
}

/**
 * Main Luma Store
 *
 * Combines all 6 slices into a single Zustand store with:
 * - Immer middleware for safe mutations
 * - Persistence middleware for selective state saving
 * - Platform-agnostic storage (web/mobile)
 *
 * Persisted state (survives app restart):
 * - tasks[]
 * - currentCapacity, maxTasks
 * - settings
 *
 * Ephemeral state (resets on load):
 * - text, isProcessing
 * - currentTaskId, elapsedTime, isActive
 * - currentView, modalOpen
 */
declare const useLumaStore: zustand.UseBoundStore<Omit<zustand.StoreApi<LumaStore>, "setState"> & {
    setState(nextStateOrUpdater: LumaStore | Partial<LumaStore> | ((state: immer.WritableDraft<LumaStore>) => void), shouldReplace?: boolean | undefined): void;
}>;
/**
 * Select all tasks
 * Use: const tasks = useLumaStore(selectTasks)
 */
declare const selectTasks: (state: LumaStore) => _multi_platform_app_types.Task[];
/**
 * Select current view
 * Use: const view = useLumaStore(selectCurrentView)
 */
declare const selectCurrentView: (state: LumaStore) => "brain-dump" | "timeline" | "focus";
/**
 * Select capacity state
 * Use: const { level, max } = useLumaStore(selectCapacity)
 */
declare const selectCapacity: (state: LumaStore) => {
    level: _multi_platform_app_types.CapacityLevel;
    max: number;
};
/**
 * Select settings
 * Use: const settings = useLumaStore(selectSettings)
 */
declare const selectSettings: (state: LumaStore) => _multi_platform_app_types.LumaUserSettings;
/**
 * Select brain dump text
 * Use: const text = useLumaStore(selectBrainDumpText)
 */
declare const selectBrainDumpText: (state: LumaStore) => string;
/**
 * Select processing state
 * Use: const isProcessing = useLumaStore(selectIsProcessing)
 */
declare const selectIsProcessing: (state: LumaStore) => boolean;
/**
 * Select focus state
 * Use: const { taskId, elapsed, active } = useLumaStore(selectFocusState)
 */
declare const selectFocusState: (state: LumaStore) => {
    taskId: string | null;
    elapsed: number;
    active: boolean;
};
/**
 * Select modal state
 * Use: const modalOpen = useLumaStore(selectModalOpen)
 */
declare const selectModalOpen: (state: LumaStore) => string | null;

/**
 * Web storage implementation using localStorage
 * Used by Next.js and other web frameworks
 */
declare const storage: StorageAdapter;

/**
 * Platform-agnostic storage interface
 * Implementations: storageAdapter.web.ts (localStorage) and storageAdapter.native.ts (AsyncStorage)
 */
interface StorageAdapter {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
}

export { type BrainDumpSlice, type CapacitySlice, type FocusSlice, type LumaStore, type SettingsSlice, type TasksSlice, type UISlice, selectBrainDumpText, selectCapacity, selectCurrentView, selectFocusState, selectIsProcessing, selectModalOpen, selectSettings, selectTasks, storage, useLumaStore as useAppStore, useLumaStore };
