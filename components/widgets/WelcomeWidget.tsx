'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sunrise, Timer, Target, Flame, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { GREETINGS, AI_INSIGHTS } from '@/lib/constants';
import { useMemo } from 'react';

interface WelcomeWidgetProps {
  config: WidgetConfig;
}

export function WelcomeWidget({ config }: WelcomeWidgetProps) {
  const {
    user,
    tasks,
    events,
    habits,
    focusSessions,
    removeWidget,
    updateWidget,
    toggleFocusMode,
  } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');

  // Calculate stats
  const stats = useMemo(() => {
    const incompleteTasks = tasks.filter((t) => !t.completed);
    const urgentTasks = incompleteTasks.filter((t) => t.priority === 'high');
    const todayEvents = events.filter((e) => e.date === today);
    const nextEvent = todayEvents[0];
    const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);
    const todaySessions = focusSessions.filter((s) => s.date === today);
    const focusMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
    const focusPercent = Math.min(Math.round((focusMinutes / 120) * 100), 100);

    return {
      taskCount: incompleteTasks.length,
      urgentCount: urgentTasks.length,
      eventCount: todayEvents.length,
      nextEvent,
      streak: maxStreak,
      focusPercent,
    };
  }, [tasks, events, habits, focusSessions, today]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return GREETINGS.morning;
    if (hour < 17) return GREETINGS.afternoon;
    if (hour < 21) return GREETINGS.evening;
    return GREETINGS.night;
  };

  // Random insight
  const insight = useMemo(() => {
    return AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)];
  }, []);

  const statCards = [
    {
      icon: Target,
      label: 'Tasks',
      value: `${stats.taskCount}`,
      subtext: stats.urgentCount > 0 ? `${stats.urgentCount} urgent` : 'All good',
      color: stats.urgentCount > 0 ? 'text-red-500' : 'text-green-500',
    },
    {
      icon: Timer,
      label: 'Events',
      value: `${stats.eventCount}`,
      subtext: stats.nextEvent ? `Next: ${stats.nextEvent.startTime}` : 'Free day',
      color: 'text-blue-500',
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${stats.streak}`,
      subtext: 'Day streak',
      color: 'text-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Focus',
      value: `${stats.focusPercent}%`,
      subtext: 'Daily goal',
      color: 'text-indigo-500',
    },
  ];

  return (
    <WidgetWrapper
      id={config.id}
      title="Welcome"
      icon={<Sunrise className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      noPadding
    >
      <div className="relative h-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0 gradient-glow" />

        <div className="relative p-4 h-full flex flex-col">
          {/* Greeting */}
          <div className="mb-4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              {getGreeting()}, {user.name}!
            </motion.h2>
            <p className="text-muted-foreground">
              It&apos;s {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/50 backdrop-blur-sm rounded-lg p-3 text-center"
              >
                <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                <div className="font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {stat.subtext}
                </div>
              </motion.div>
            ))}
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-2 mb-4 p-3 bg-indigo-500/10 rounded-lg"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{insight}</p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button
              onClick={toggleFocusMode}
              className="flex-1 gradient-primary text-white"
            >
              Start Focus Session
            </Button>
            <Button variant="outline" className="flex-1">
              Review Tasks
            </Button>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
}
