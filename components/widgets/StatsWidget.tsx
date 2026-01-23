'use client';

import { useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface StatsWidgetProps {
  config: WidgetConfig;
}

export function StatsWidget({ config }: StatsWidgetProps) {
  const { focusSessions, tasks, habits, removeWidget, updateWidget } = useStore();

  // Calculate weekly stats
  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');

      const focusMinutes = focusSessions
        .filter((s) => s.date === dateStr)
        .reduce((acc, s) => acc + s.duration, 0);

      data.push({
        day: format(date, 'EEE'),
        focus: Math.round(focusMinutes / 60 * 10) / 10, // Hours
        date: dateStr,
      });
    }
    return data;
  }, [focusSessions]);

  // Calculate totals
  const stats = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastWeekStart = format(subDays(new Date(), 13), 'yyyy-MM-dd');
    const thisWeekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd');

    // This week focus
    const thisWeekFocus = focusSessions
      .filter((s) => s.date >= thisWeekStart)
      .reduce((acc, s) => acc + s.duration, 0);

    // Last week focus
    const lastWeekFocus = focusSessions
      .filter((s) => s.date >= lastWeekStart && s.date < thisWeekStart)
      .reduce((acc, s) => acc + s.duration, 0);

    const focusChange = lastWeekFocus > 0
      ? Math.round(((thisWeekFocus - lastWeekFocus) / lastWeekFocus) * 100)
      : 0;

    // Tasks completed this week
    const thisWeekTasks = tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt >= thisWeekStart
    ).length;

    const lastWeekTasks = tasks.filter(
      (t) =>
        t.completed &&
        t.completedAt &&
        t.completedAt >= lastWeekStart &&
        t.completedAt < thisWeekStart
    ).length;

    const tasksChange = lastWeekTasks > 0
      ? Math.round(((thisWeekTasks - lastWeekTasks) / lastWeekTasks) * 100)
      : 0;

    // Habit completion rate
    const habitDates = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    );

    const totalPossible = habits.length * 7;
    const completed = habits.reduce(
      (acc, h) => acc + habitDates.filter((d) => h.completedDates.includes(d)).length,
      0
    );

    const habitRate = totalPossible > 0
      ? Math.round((completed / totalPossible) * 100)
      : 0;

    // Previous week habit rate
    const prevHabitDates = Array.from({ length: 7 }, (_, i) =>
      format(subDays(new Date(), 13 - i), 'yyyy-MM-dd')
    );

    const prevCompleted = habits.reduce(
      (acc, h) => acc + prevHabitDates.filter((d) => h.completedDates.includes(d)).length,
      0
    );

    const prevHabitRate = totalPossible > 0
      ? Math.round((prevCompleted / totalPossible) * 100)
      : 0;

    const habitChange = habitRate - prevHabitRate;

    return {
      focusHours: Math.round(thisWeekFocus / 60 * 10) / 10,
      focusChange,
      tasksCompleted: thisWeekTasks,
      tasksChange,
      habitRate,
      habitChange,
    };
  }, [focusSessions, tasks, habits]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const formatChange = (change: number) => {
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return '0%';
  };

  return (
    <WidgetWrapper
      id={config.id}
      title="Productivity Stats"
      icon={<BarChart3 className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      }
      noPadding
    >
      <div className="flex flex-col h-full p-4">
        {/* Chart */}
        <div className="min-h-[120px] flex-1 mb-4">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weeklyData}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}h`, 'Focus']}
              />
              <Bar
                dataKey="focus"
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.focusHours}h</p>
            <p className="text-xs text-muted-foreground mb-1">Focus Time</p>
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon(stats.focusChange)}
              <span
                className={cn(
                  'text-xs',
                  stats.focusChange > 0
                    ? 'text-green-500'
                    : stats.focusChange < 0
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                )}
              >
                {formatChange(stats.focusChange)}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
            <p className="text-xs text-muted-foreground mb-1">Tasks Done</p>
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon(stats.tasksChange)}
              <span
                className={cn(
                  'text-xs',
                  stats.tasksChange > 0
                    ? 'text-green-500'
                    : stats.tasksChange < 0
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                )}
              >
                {formatChange(stats.tasksChange)}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">{stats.habitRate}%</p>
            <p className="text-xs text-muted-foreground mb-1">Habits</p>
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon(stats.habitChange)}
              <span
                className={cn(
                  'text-xs',
                  stats.habitChange > 0
                    ? 'text-green-500'
                    : stats.habitChange < 0
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                )}
              >
                {formatChange(stats.habitChange)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
}
