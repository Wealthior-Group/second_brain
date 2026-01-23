'use client';

import { motion } from 'framer-motion';
import { Target, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';

interface GoalsWidgetProps {
  config: WidgetConfig;
}

export function GoalsWidget({ config }: GoalsWidgetProps) {
  const { goals, removeWidget, updateWidget, toggleMilestone } = useStore();

  return (
    <WidgetWrapper
      id={config.id}
      title="Goals"
      icon={<Target className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <span className="text-xs text-muted-foreground">Q4 2024</span>
      }
      noPadding
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {goals.map((goal, index) => {
            const progress = Math.round((goal.current / goal.target) * 100);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium truncate pr-2">
                    {goal.title}
                  </h4>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {progress}%
                  </span>
                </div>

                <Progress
                  value={progress}
                  className="h-2 mb-2"
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {goal.milestones ? (
                    <span>
                      {goal.milestones.filter((m) => m.completed).length} of{' '}
                      {goal.milestones.length} milestones
                    </span>
                  ) : (
                    <span>
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  )}

                  {progress >= 100 && (
                    <span className="text-green-500 font-medium">Complete!</span>
                  )}
                </div>

                {/* Milestones */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {goal.milestones.slice(0, 3).map((milestone) => (
                      <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(goal.id, milestone.id)}
                        className="flex items-center gap-2 text-xs w-full text-left hover:bg-accent/50 p-1 rounded"
                      >
                        <span
                          className={
                            milestone.completed
                              ? 'text-green-500'
                              : 'text-muted-foreground'
                          }
                        >
                          {milestone.completed ? '✓' : '○'}
                        </span>
                        <span
                          className={
                            milestone.completed
                              ? 'line-through text-muted-foreground'
                              : ''
                          }
                        >
                          {milestone.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </WidgetWrapper>
  );
}
