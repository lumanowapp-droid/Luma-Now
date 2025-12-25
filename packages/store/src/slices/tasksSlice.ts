import { StateCreator } from 'zustand'
import { LumaStore, TasksSlice, Task } from '../types'

const initialState = {
  tasks: [],
}

/**
 * Tasks Slice
 *
 * Core task management with rich Task type from packages/types.
 * Supports CRUD operations, reordering, and auto-generation of id/order/timestamps.
 * This state is persisted - survives app restarts.
 */
export const createTasksSlice: StateCreator<
  LumaStore,
  [['zustand/immer', never]],
  [],
  TasksSlice
> = (set) => ({
  ...initialState,

  addTask: (task) => {
    set((state) => {
      const newTask: Task = {
        ...task,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        order: state.tasks.length,
      }
      state.tasks.push(newTask)
    })
  },

  addTasks: (tasks) => {
    set((state) => {
      const startOrder = state.tasks.length
      const newTasks: Task[] = tasks.map((task, index) => ({
        ...task,
        id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        order: startOrder + index,
      }))
      state.tasks.push(...newTasks)
    })
  },

  toggleTask: (id) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id)
      if (task) {
        task.completed = !task.completed
        task.completedAt = task.completed ? new Date() : undefined
      }
    })
  },

  removeTask: (id) => {
    set((state) => {
      const index = state.tasks.findIndex((t) => t.id === id)
      if (index !== -1) {
        state.tasks.splice(index, 1)
        // Reorder remaining tasks
        state.tasks.forEach((task, idx) => {
          task.order = idx
        })
      }
    })
  },

  updateTask: (id, updates) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id)
      if (task) {
        Object.assign(task, updates)
      }
    })
  },

  clearCompleted: () => {
    set((state) => {
      state.tasks = state.tasks.filter((t) => !t.completed)
      // Reorder remaining tasks
      state.tasks.forEach((task, idx) => {
        task.order = idx
      })
    })
  },

  reorderTasks: (taskIds) => {
    set((state) => {
      const taskMap = new Map(state.tasks.map((t) => [t.id, t]))
      state.tasks = taskIds.map((id) => taskMap.get(id)!).filter(Boolean)
      state.tasks.forEach((task, idx) => {
        task.order = idx
      })
    })
  },
})
