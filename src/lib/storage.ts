export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const TASKS_KEY = 'planner_tasks';
const SYNC_STATUS_KEY = 'planner_sync_status';

export const storage = {
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      storage.updateSyncStatus();
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
    const tasks = storage.getTasks();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    storage.saveTasks(tasks);
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>): Task | null => {
    const tasks = storage.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storage.saveTasks(tasks);
    return tasks[index];
  },

  deleteTask: (id: string): boolean => {
    const tasks = storage.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) return false;
    storage.saveTasks(filtered);
    return true;
  },

  updateSyncStatus: () => {
    localStorage.setItem(SYNC_STATUS_KEY, new Date().toISOString());
  },

  getLastSyncTime: (): string | null => {
    return localStorage.getItem(SYNC_STATUS_KEY);
  },

  clearAll: () => {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(SYNC_STATUS_KEY);
  }
};
