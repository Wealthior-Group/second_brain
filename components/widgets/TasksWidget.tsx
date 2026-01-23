'use client';

import { useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Circle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig, Task } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TasksWidgetProps {
  config: WidgetConfig;
}

export function TasksWidget({ config }: TasksWidgetProps) {
  const { tasks, addTask, toggleTask, removeWidget, updateWidget } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Filter and sort tasks
  const todayTasks = tasks
    .filter((t) => {
      if (t.completed) return true;
      if (!t.dueDate) return true;
      return isToday(parseISO(t.dueDate)) || parseISO(t.dueDate) <= new Date();
    })
    .sort((a, b) => {
      // Incomplete first
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 6);

  const completedCount = tasks.filter((t) => t.completed).length;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      priority: 'medium',
      completed: false,
      tags: [],
    });
    setNewTaskTitle('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTaskTitle('');
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
    }
  };

  const getPriorityDot = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  };

  return (
    <WidgetWrapper
      id={config.id}
      title="Tasks"
      icon={<CheckSquare className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      }
      noPadding
    >
      <div className="flex flex-col h-full">
        {/* Progress */}
        <div className="px-4 py-2 border-b">
          <p className="text-xs text-muted-foreground">
            {completedCount} of {tasks.length} completed
          </p>
        </div>

        {/* Task List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <AnimatePresence mode="popLayout">
              {todayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={cn(
                    'flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group',
                    task.completed && 'opacity-60'
                  )}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm truncate',
                        task.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </p>
                    {(task.dueDate || task.dueTime) && !task.completed && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {task.dueTime || (task.dueDate && format(parseISO(task.dueDate), 'MMM d'))}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs shrink-0">
                    {getPriorityDot(task.priority)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Task Input */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-2"
                >
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (!newTaskTitle.trim()) setIsAdding(false);
                    }}
                    placeholder="Task name..."
                    className="h-8 text-sm"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add task
          </Button>
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              View all
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </WidgetWrapper>
  );
}
