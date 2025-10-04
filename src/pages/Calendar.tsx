import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { TaskCard } from '@/components/TaskCard';
import { TaskDialog } from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/lib/storage';
import { cn } from '@/lib/utils';

const Calendar = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, getTasksByDate } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<'week' | 'month'>('week');

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentDate);

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleSave = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      addTask(data);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
      deleteTask(id);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendário</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView('week')}>
              Semana
            </Button>
            <Button variant="outline" size="sm" onClick={() => setView('month')}>
              Mês
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {weekDates[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = getTasksByDate(dateStr);
            const completedCount = dayTasks.filter(t => t.completed).length;

            return (
              <Card
                key={dateStr}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-card",
                  selectedDate === dateStr && "ring-2 ring-primary",
                  isToday(date) && "bg-accent"
                )}
                onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </p>
                      <p className="text-2xl font-bold">{date.getDate()}</p>
                    </div>
                    {dayTasks.length > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {completedCount}/{dayTasks.length}
                        </p>
                        <div className="h-2 w-12 bg-secondary rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-success transition-all"
                            style={{
                              width: `${(completedCount / dayTasks.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {dayTasks.length > 0 && (
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "text-xs p-2 rounded bg-secondary truncate",
                            task.completed && "line-through opacity-60"
                          )}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{dayTasks.length - 3} mais
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {selectedDate && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Tarefas de {new Date(selectedDate + 'T00:00').toLocaleDateString('pt-BR')}
              </h3>
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setDialogOpen(true);
                }}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova
              </Button>
            </div>

            <div className="space-y-3">
              {getTasksByDate(selectedDate).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSave={handleSave}
        task={editingTask}
        defaultDate={selectedDate || undefined}
      />
    </Layout>
  );
};

export default Calendar;
