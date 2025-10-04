import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';
import { showNotification } from '@/lib/notifications';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  taskTitle?: string;
  onClose?: () => void;
}

type TimerMode = 'focus' | 'break';

export const PomodoroTimer = ({ taskTitle, onClose }: PomodoroTimerProps) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const focusTime = 25 * 60;
  const breakTime = 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (soundEnabled) {
      playSound();
    }

    const nextMode = mode === 'focus' ? 'break' : 'focus';
    const message = mode === 'focus' 
      ? '🎉 Foco concluído! Hora de uma pausa.'
      : '✨ Pausa concluída! Pronto para focar novamente.';

    showNotification('Pomodoro Timer', { body: message });

    setMode(nextMode);
    setTimeLeft(nextMode === 'focus' ? focusTime : breakTime);
  };

  const playSound = () => {
    // Som simples usando AudioContext
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusTime : breakTime);
  };

  const switchMode = () => {
    setIsRunning(false);
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setTimeLeft(nextMode === 'focus' ? focusTime : breakTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus'
    ? ((focusTime - timeLeft) / focusTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', duration: 0.3 }}
    >
      <Card className="p-6 space-y-6 relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-500",
            mode === 'focus' ? 'bg-primary/5' : 'bg-success/5'
          )}
        />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {mode === 'focus' ? '🎯 Modo Foco' : '☕ Pausa'}
              </h3>
              {taskTitle && (
                <p className="text-sm text-muted-foreground">{taskTitle}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="w-48 h-48 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={mode === 'focus' ? 'text-primary' : 'text-success'}
                  initial={{ strokeDasharray: '552.92', strokeDashoffset: '552.92' }}
                  animate={{
                    strokeDashoffset: 552.92 - (552.92 * progress) / 100,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold tabular-nums"
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-12 w-12 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button
              size="icon"
              onClick={toggleTimer}
              className="h-16 w-16 rounded-full"
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              onClick={switchMode}
              className="h-12 px-4 rounded-full"
            >
              {mode === 'focus' ? '☕' : '🎯'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
