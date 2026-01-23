'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO,
} from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarWidgetProps {
  config: WidgetConfig;
}

export function CalendarWidget({ config }: CalendarWidgetProps) {
  const { events, removeWidget, updateWidget } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return events
      .filter((e) => e.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, selectedDate]);

  // Check if date has events
  const hasEvents = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.some((e) => e.date === dateStr);
  };

  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <WidgetWrapper
      id={config.id}
      title="Calendar"
      icon={<Calendar className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      noPadding
    >
      <div className="flex flex-col h-full">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2">
          {/* Week days header */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const dayHasEvents = hasEvents(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'relative p-1 text-center text-xs rounded-md transition-colors',
                    !isCurrentMonth && 'text-muted-foreground/40',
                    isCurrentMonth && 'hover:bg-accent',
                    isToday && 'bg-indigo-500 text-white hover:bg-indigo-600',
                    isSelected && !isToday && 'bg-accent'
                  )}
                >
                  {format(day, 'd')}
                  {dayHasEvents && (
                    <span
                      className={cn(
                        'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                        isToday ? 'bg-white' : 'bg-indigo-500'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events for selected date */}
        <div className="flex-1 border-t">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">
              {isSameDay(selectedDate, new Date())
                ? 'Today'
                : format(selectedDate, 'EEEE, MMM d')}
            </p>
          </div>
          <ScrollArea className="h-[80px]">
            <div className="px-3 space-y-1">
              {selectedDateEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No events</p>
              ) : (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-2 py-1"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {event.startTime}
                    </span>
                    <span className="text-xs truncate">{event.title}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </WidgetWrapper>
  );
}
