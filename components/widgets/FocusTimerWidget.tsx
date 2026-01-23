'use client';

import { useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, SkipForward, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface FocusTimerWidgetProps {
  config: WidgetConfig;
}

export function FocusTimerWidget({ config }: FocusTimerWidgetProps) {
  const {
    timerState,
    timerSettings,
    setTimerState,
    addFocusSession,
    focusSessions,
    removeWidget,
    updateWidget,
    tasks,
  } = useStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (timerSettings.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    if (!timerState.isBreak) {
      // Focus session completed
      addFocusSession({
        date: format(new Date(), 'yyyy-MM-dd'),
        duration: timerSettings.focusDuration,
        completedAt: new Date().toISOString(),
      });

      // Check if long break is needed
      const nextSession = timerState.currentSession + 1;
      const isLongBreak = nextSession > timerSettings.sessionsUntilLongBreak;

      setTimerState({
        status: timerSettings.autoStartBreaks ? 'running' : 'break',
        timeRemaining: isLongBreak
          ? timerSettings.longBreakDuration * 60
          : timerSettings.shortBreakDuration * 60,
        currentSession: isLongBreak ? 1 : nextSession,
        isBreak: true,
      });
    } else {
      // Break completed
      setTimerState({
        status: timerSettings.autoStartFocus ? 'running' : 'idle',
        timeRemaining: timerSettings.focusDuration * 60,
        isBreak: false,
      });
    }
  }, [timerState, timerSettings, addFocusSession, setTimerState]);

  // Timer logic
  useEffect(() => {
    if (timerState.status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimerState({ timeRemaining: timerState.timeRemaining - 1 });

        if (timerState.timeRemaining <= 1) {
          handleTimerComplete();
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.status, timerState.timeRemaining, handleTimerComplete, setTimerState]);

  const startTimer = () => {
    setTimerState({ status: 'running' });
  };

  const pauseTimer = () => {
    setTimerState({ status: 'paused' });
  };

  const resetTimer = () => {
    setTimerState({
      status: 'idle',
      timeRemaining: timerSettings.focusDuration * 60,
      isBreak: false,
    });
  };

  const skipToBreak = () => {
    setTimerState({
      status: 'idle',
      timeRemaining: timerSettings.shortBreakDuration * 60,
      isBreak: true,
    });
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const totalTime = timerState.isBreak
    ? timerSettings.shortBreakDuration * 60
    : timerSettings.focusDuration * 60;
  const progress = (totalTime - timerState.timeRemaining) / totalTime;

  // Today's stats
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = focusSessions.filter((s) => s.date === today);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  // Current task (first incomplete high priority task)
  const currentTask = tasks.find((t) => !t.completed && t.priority === 'high');

  // SVG circle properties
  const size = 120;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <WidgetWrapper
      id={config.id}
      title="Focus Timer"
      icon={<Timer className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      noPadding
    >
      <div className="flex flex-col items-center justify-center h-full p-4">
        {/* Timer Circle */}
        <div className="relative mb-4">
          <svg width={size} height={size} className="timer-ring">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">
              {formatTime(timerState.timeRemaining)}
            </span>
            <span className="text-xs text-muted-foreground">
              {timerState.isBreak ? (
                <span className="flex items-center gap-1">
                  <Coffee className="w-3 h-3" />
                  Break
                </span>
              ) : (
                'Focus'
              )}
            </span>
          </div>
        </div>

        {/* Session indicator */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: timerSettings.sessionsUntilLongBreak }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i < timerState.currentSession - 1
                  ? 'bg-indigo-500'
                  : i === timerState.currentSession - 1 && timerState.status !== 'idle'
                  ? 'bg-indigo-500 animate-pulse'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-4">
          {timerState.status === 'running' ? (
            <Button variant="outline" size="icon" onClick={pauseTimer}>
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="gradient-primary text-white"
              size="icon"
              onClick={startTimer}
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={resetTimer}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          {!timerState.isBreak && (
            <Button variant="outline" size="icon" onClick={skipToBreak}>
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Today: {todaySessions.length} sessions ({Math.round(todayMinutes / 60 * 10) / 10}h)</p>
          {currentTask && (
            <p className="mt-1 truncate max-w-[180px]">
              Working on: {currentTask.title}
            </p>
          )}
        </div>
      </div>
    </WidgetWrapper>
  );
}
