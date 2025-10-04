import { useState, useEffect } from 'react';
import { Task, storage } from '@/lib/storage';
import { toast } from 'sonner';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = () => {
      const loadedTasks = storage.getTasks();
      setTasks(loadedTasks);
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask = storage.addTask(taskData);
    setTasks(prev => [...prev, newTask]);
    toast.success('Tarefa criada com sucesso!');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = storage.updateTask(id, updates);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      toast.success('Tarefa atualizada!');
    }
    return updated;
  };

  const deleteTask = (id: string) => {
    const success = storage.deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Tarefa excluída!');
    }
    return success;
  };

  const toggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const getTasksByDate = (date: string) => {
    return tasks.filter(t => t.date === date);
  };

  const getTasksForWeek = (startDate: Date) => {
    const weekTasks: { [key: string]: Task[] } = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      weekTasks[dateStr] = getTasksByDate(dateStr);
    }
    return weekTasks;
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTasksByDate,
    getTasksForWeek,
  };
};
