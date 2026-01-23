'use client';

import { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { MOOD_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodWidgetProps {
  config: WidgetConfig;
}

export function MoodWidget({ config }: MoodWidgetProps) {
  const { moodEntries, logMood, removeWidget, updateWidget } = useStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMood = moodEntries.find((e) => e.date === today);

  // Last 7 days moods
  const weekMoods = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      const entry = moodEntries.find((e) => e.date === date);
      return {
        date,
        mood: entry?.mood,
        isToday: date === today,
      };
    });
  }, [moodEntries, today]);

  const handleMoodSelect = (mood: number) => {
    logMood(mood);
  };

  return (
    <WidgetWrapper
      id={config.id}
      title="Mood Check"
      icon={<Smile className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      noPadding
    >
      <div className="flex flex-col h-full p-4">
        {/* Question */}
        <p className="text-sm text-center mb-4">
          {todayMood ? 'How are you feeling now?' : 'How are you feeling today?'}
        </p>

        {/* Mood Selector */}
        <div className="flex justify-center gap-2 mb-4">
          {MOOD_EMOJIS.map((emoji, index) => {
            const moodValue = index + 1;
            const isSelected = todayMood?.mood === moodValue;

            return (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(moodValue)}
                className={cn(
                  'text-2xl p-2 rounded-lg transition-all',
                  isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                    : 'hover:bg-accent'
                )}
              >
                {emoji}
              </motion.button>
            );
          })}
        </div>

        {/* Week Overview */}
        <div className="flex justify-center gap-1.5 mt-auto pt-3 border-t">
          <span className="text-xs text-muted-foreground mr-2">This week:</span>
          {weekMoods.map((day) => (
            <div
              key={day.date}
              className={cn(
                'w-6 h-6 flex items-center justify-center rounded-full text-sm',
                day.isToday && !day.mood && 'border-2 border-dashed border-muted-foreground',
                day.isToday && day.mood && 'ring-2 ring-indigo-500'
              )}
            >
              {day.mood ? MOOD_EMOJIS[day.mood - 1] : '○'}
            </div>
          ))}
        </div>
      </div>
    </WidgetWrapper>
  );
}
