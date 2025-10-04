export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Este navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/placeholder.svg',
      badge: '/placeholder.svg',
      ...options,
    });
  }
};

export const scheduleTaskNotification = (taskTitle: string, date: Date) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff > 0 && diff < 24 * 60 * 60 * 1000) { // Próximas 24h
    setTimeout(() => {
      showNotification('Lembrete de Tarefa', {
        body: taskTitle,
        tag: `task-${Date.now()}`,
        requireInteraction: true,
      });
    }, diff);
  }
};

export const getNotificationSettings = (): boolean => {
  return localStorage.getItem('notifications-enabled') === 'true';
};

export const setNotificationSettings = (enabled: boolean) => {
  localStorage.setItem('notifications-enabled', String(enabled));
};
