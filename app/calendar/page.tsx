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
  addDays,
} from 'date-fns';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  Edit2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { CalendarEvent } from '@/types';
import { cn } from '@/lib/utils';
import { EVENT_COLORS } from '@/lib/constants';

export default function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting' as CalendarEvent['type'],
  });

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

  // Get events count per day for current month view
  const eventsPerDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const existing = map.get(event.date) || [];
      map.set(event.date, [...existing, event]);
    });
    return map;
  }, [events]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

    addEvent({
      title: newEvent.title.trim(),
      date: newEvent.date,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      type: newEvent.type,
      color: EVENT_COLORS[newEvent.type],
    });

    setNewEvent({
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
    });
    setIsAddOpen(false);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    updateEvent(editingEvent.id, {
      title: editingEvent.title,
      date: editingEvent.date,
      startTime: editingEvent.startTime,
      endTime: editingEvent.endTime,
      type: editingEvent.type,
      color: EVENT_COLORS[editingEvent.type],
    });

    setEditingEvent(null);
  };

  const openAddDialog = (date?: Date) => {
    setNewEvent({
      ...newEvent,
      date: format(date || selectedDate, 'yyyy-MM-dd'),
    });
    setIsAddOpen(true);
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium min-w-[160px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentMonth(new Date());
                  setSelectedDate(new Date());
                }}
              >
                Today
              </Button>
              <Button onClick={() => openAddDialog()} className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 border rounded-lg bg-card overflow-hidden">
            {/* Week days header */}
            <div className="grid grid-cols-7 border-b">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 grid-rows-6 flex-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                const dayEvents = eventsPerDay.get(format(day, 'yyyy-MM-dd')) || [];

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'min-h-[100px] p-2 border-r border-b cursor-pointer transition-colors',
                      'last:border-r-0 [&:nth-child(7n)]:border-r-0',
                      !isCurrentMonth && 'bg-muted/30',
                      isSelected && 'bg-indigo-500/10',
                      'hover:bg-accent/50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-sm w-7 h-7 flex items-center justify-center rounded-full',
                          !isCurrentMonth && 'text-muted-foreground',
                          isToday && 'bg-indigo-500 text-white font-medium'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-[10px] px-1.5 py-0.5 rounded truncate"
                          style={{ backgroundColor: `${event.color}20`, color: event.color }}
                        >
                          {event.startTime} {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Events */}
        <div className="w-80 shrink-0 border rounded-lg bg-card flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-medium">
              {isSameDay(selectedDate, new Date())
                ? 'Today'
                : format(selectedDate, 'EEEE, MMMM d')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No events</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddDialog()}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add event
                  </Button>
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors group"
                  >
                    <div
                      className="w-1 rounded-full shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              onClick={() => openAddDialog()}
              className="w-full gradient-primary text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select
                value={newEvent.type}
                onValueChange={(v) => setNewEvent({ ...newEvent, type: v as CalendarEvent['type'] })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="focus">Focus Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddEvent}
              disabled={!newEvent.title.trim()}
              className="w-full gradient-primary text-white"
            >
              Add Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, date: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, startTime: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="time"
                    value={editingEvent.endTime || ''}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, endTime: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={editingEvent.type}
                  onValueChange={(v) =>
                    setEditingEvent({ ...editingEvent, type: v as CalendarEvent['type'] })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="focus">Focus Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateEvent} className="w-full gradient-primary text-white">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
