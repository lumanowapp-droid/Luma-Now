import { Task, CapacityLevel, LumaUserSettings } from '@multi-platform-app/types'

// Re-export types from packages/types for convenience
export type { Task, CapacityLevel, LumaUserSettings, TaskCategory, AIProvider } from '@multi-platform-app/types'

// ===================================
// BRAIN DUMP SLICE
// ===================================

export interface BrainDumpState {
  text: string
  isProcessing: boolean
}

export interface BrainDumpActions {
  setText: (text: string) => void
  setIsProcessing: (isProcessing: boolean) => void
  compress: () => Promise<void>
  reset: () => void
}

export type BrainDumpSlice = BrainDumpState & BrainDumpActions

// ===================================
// TASKS SLICE
// ===================================

export interface TasksState {
  tasks: Task[]
}

export interface TasksActions {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void
  addTasks: (tasks: Omit<Task, 'id' | 'createdAt' | 'order'>[]) => void
  toggleTask: (id: string) => void
  removeTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  clearCompleted: () => void
  reorderTasks: (taskIds: string[]) => void
}

export type TasksSlice = TasksState & TasksActions

// ===================================
// CAPACITY SLICE
// ===================================

export interface CapacityState {
  currentCapacity: CapacityLevel
  maxTasks: number
}

export interface CapacityActions {
  setCapacity: (level: CapacityLevel) => void
  getMaxTasksForCapacity: (level: CapacityLevel) => number
}

export type CapacitySlice = CapacityState & CapacityActions

// ===================================
// FOCUS SLICE
// ===================================

export interface FocusState {
  currentTaskId: string | null
  elapsedTime: number
  isActive: boolean
}

export interface FocusActions {
  startFocus: (taskId: string) => void
  endFocus: () => void
  updateElapsedTime: (seconds: number) => void
}

export type FocusSlice = FocusState & FocusActions

// ===================================
// UI SLICE
// ===================================

export interface UIState {
  currentView: 'brain-dump' | 'timeline' | 'focus'
  modalOpen: string | null
}

export interface UIActions {
  setCurrentView: (view: 'brain-dump' | 'timeline' | 'focus') => void
  openModal: (modalId: string) => void
  closeModal: () => void
}

export type UISlice = UIState & UIActions

// ===================================
// SETTINGS SLICE
// ===================================

export interface SettingsState {
  settings: LumaUserSettings
}

export interface SettingsActions {
  updateSettings: (updates: Partial<LumaUserSettings>) => void
  resetSettings: () => void
}

export type SettingsSlice = SettingsState & SettingsActions

// ===================================
// COMBINED STORE
// ===================================

export interface LumaStore
  extends BrainDumpSlice,
    TasksSlice,
    CapacitySlice,
    FocusSlice,
    UISlice,
    SettingsSlice {}
