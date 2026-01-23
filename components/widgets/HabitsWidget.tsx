'use client';

import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Target, Flame, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface HabitsWidgetProps {
  config: WidgetConfig;
}

export function HabitsWidget({ config }: HabitsWidgetProps) {
  const { habits, toggleHabitDay, removeWidget, updateWidget } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');

  // Get last 7 days
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        dayName: format(date, 'EEE')[0],
        isToday: format(date, 'yyyy-MM-dd') === today,
      };
    });
  }, [today]);

  // Calculate max streak
  const maxStreak = Math.max(...habits.map((h) => h.currentStreak), 0);

  // Today's completion count
  const todayCompleted = habits.filter((h) =>
    h.completedDates.includes(today)
  ).length;

  return (
    <WidgetWrapper
      id={config.id}
      title="Habits"
      icon={<Target className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
          <Flame className="w-3 h-3" />
          {maxStreak}
        </div>
      }
      noPadding
    >
      <div className="flex flex-col h-full">
        {/* Day headers */}
        <div className="px-4 py-2 border-b">
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <div className="w-24" />
            <div className="grid grid-cols-7 gap-1">
              {last7Days.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    'text-center text-[10px] font-medium',
                    day.isToday ? 'text-indigo-500' : 'text-muted-foreground'
                  )}
                >
                  {day.dayName}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habits List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {habits.map((habit, index) => {
              const weekCompleted = last7Days.filter((day) =>
                habit.completedDates.includes(day.date)
              ).length;

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-[auto_1fr_auto] gap-4 items-center"
                >
                  {/* Habit name */}
                  <div className="flex items-center gap-2 w-24">
                    <span>{habit.emoji}</span>
                    <span className="text-xs truncate">{habit.name}</span>
                  </div>

                  {/* Week dots */}
                  <div className="grid grid-cols-7 gap-1">
                    {last7Days.map((day) => {
                      const isCompleted = habit.completedDates.includes(day.date);
                      const isClickable = day.isToday;

                      return (
                        <button
                          key={day.date}
                          onClick={() => isClickable && toggleHabitDay(habit.id, day.date)}
                          disabled={!isClickable}
                          className={cn(
                            'w-full aspect-square rounded-full flex items-center justify-center transition-all',
                            isCompleted
                              ? 'bg-indigo-500 text-white'
                              : 'bg-muted',
                            isClickable && !isCompleted && 'hover:bg-indigo-200 dark:hover:bg-indigo-900',
                            isClickable && 'cursor-pointer'
                          )}
                        >
                          {isCompleted && <Check className="w-2.5 h-2.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Week count */}
                  <div className="text-xs text-muted-foreground w-8 text-right">
                    {weekCompleted}/7
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Today: {todayCompleted}/{habits.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              habits.forEach((h) => {
                if (!h.completedDates.includes(today)) {
                  toggleHabitDay(h.id, today);
                }
              });
            }}
          >
            <Check className="w-3 h-3 mr-1" />
            Mark all done
          </Button>
        </div>
      </div>
    </WidgetWrapper>
  );
}
