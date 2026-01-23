'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import {
  Task,
  CalendarEvent,
  Note,
  Habit,
  FocusSession,
  MoodEntry,
  Capture,
  ChatMessage,
  Bookmark,
  Goal,
  NewsItem,
  Weather,
  WidgetConfig,
  TimerState,
  TimerSettings,
  WIDGET_SIZES,
} from '@/types';
import {
  initialTasks,
  initialEvents,
  initialNotes,
  initialHabits,
  initialFocusSessions,
  initialMoodEntries,
  initialBookmarks,
  initialGoals,
  initialNews,
  initialWeather,
} from './mock-data';
import { DEFAULT_WIDGETS, DEFAULT_TIMER_SETTINGS, WIDGET_REGISTRY } from './constants';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

interface SecondBrainState {
  // User
  user: {
    name: string;
    avatar?: string;
    timezone: string;
  };
  setUser: (user: Partial<SecondBrainState['user']>) => void;

  // Dashboard
  widgets: WidgetConfig[];
  setWidgets: (widgets: WidgetConfig[]) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  addWidget: (type: WidgetConfig['type']) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (activeId: string, overId: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Notes
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Calendar
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'currentStreak' | 'longestStreak' | 'createdAt'>) => void;
  toggleHabitDay: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;

  // Focus Timer
  timerState: TimerState;
  timerSettings: TimerSettings;
  setTimerState: (state: Partial<TimerState>) => void;
  setTimerSettings: (settings: Partial<TimerSettings>) => void;
  focusSessions: FocusSession[];
  addFocusSession: (session: Omit<FocusSession, 'id'>) => void;

  // Quick Capture
  captures: Capture[];
  addCapture: (text: string) => void;
  processCapture: (id: string, action: 'task' | 'note' | 'event' | 'dismiss') => void;
  deleteCapture: (id: string) => void;

  // Mood
  moodEntries: MoodEntry[];
  logMood: (mood: number, note?: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;

  // News
  news: NewsItem[];
  toggleSaveNews: (id: string) => void;

  // Weather
  weather: Weather;
  setWeather: (weather: Weather) => void;

  // UI State
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  focusModeActive: boolean;
  toggleFocusMode: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;

  // Data Management
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAllData: () => void;
}

export const useStore = create<SecondBrainState>()(
  persist(
    (set, get) => ({
      // User
      user: {
        name: 'Roberto',
        timezone: 'Europe/Zurich',
      },
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),

      // Dashboard
      widgets: DEFAULT_WIDGETS,
      setWidgets: (widgets) => set({ widgets }),
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),
      addWidget: (type) => {
        const state = get();
        const registry = WIDGET_REGISTRY[type];
        const defaultSize = registry?.defaultSize || 'medium';
        const size = WIDGET_SIZES[defaultSize];
        const newWidget: WidgetConfig = {
          id: `${type}-${generateId()}`,
          type,
          size,
          position: state.widgets.length,
          visible: true,
        };
        set({ widgets: [...state.widgets, newWidget] });
      },
      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
      reorderWidgets: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.widgets.findIndex((w) => w.id === activeId);
          const newIndex = state.widgets.findIndex((w) => w.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;

          const newWidgets = [...state.widgets];
          const [movedWidget] = newWidgets.splice(oldIndex, 1);
          newWidgets.splice(newIndex, 0, movedWidget);

          return {
            widgets: newWidgets.map((w, i) => ({ ...w, position: i })),
          };
        }),

      // Tasks
      tasks: initialTasks,
      addTask: (task) =>
        set((state) => ({
          tasks: [
            {
              ...task,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
            ...state.tasks,
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : undefined,
                }
              : t
          ),
        })),

      // Notes
      notes: initialNotes,
      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              ...note,
              id: generateId(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.notes,
          ],
        })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, ...updates, updatedAt: new Date().toISOString() }
              : n
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      // Calendar
      events: initialEvents,
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: generateId() }],
        })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      // Habits
      habits: initialHabits,
      addHabit: (habit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id: generateId(),
              completedDates: [],
              currentStreak: 0,
              longestStreak: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      toggleHabitDay: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const isCompleted = h.completedDates.includes(date);
            const newCompletedDates = isCompleted
              ? h.completedDates.filter((d) => d !== date)
              : [...h.completedDates, date];

            // Recalculate streak
            let currentStreak = 0;
            const today = format(new Date(), 'yyyy-MM-dd');
            let checkDate = new Date();

            while (true) {
              const dateStr = format(checkDate, 'yyyy-MM-dd');
              if (newCompletedDates.includes(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
              } else if (dateStr === today) {
                checkDate.setDate(checkDate.getDate() - 1);
              } else {
                break;
              }
            }

            return {
              ...h,
              completedDates: newCompletedDates,
              currentStreak,
              longestStreak: Math.max(h.longestStreak, currentStreak),
            };
          }),
        })),
      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      // Focus Timer
      timerState: {
        status: 'idle',
        timeRemaining: DEFAULT_TIMER_SETTINGS.focusDuration * 60,
        currentSession: 1,
        isBreak: false,
      },
      timerSettings: DEFAULT_TIMER_SETTINGS,
      setTimerState: (state) =>
        set((prev) => ({ timerState: { ...prev.timerState, ...state } })),
      setTimerSettings: (settings) =>
        set((prev) => ({ timerSettings: { ...prev.timerSettings, ...settings } })),
      focusSessions: initialFocusSessions,
      addFocusSession: (session) =>
        set((state) => ({
          focusSessions: [{ ...session, id: generateId() }, ...state.focusSessions],
        })),

      // Quick Capture
      captures: [],
      addCapture: (text) =>
        set((state) => ({
          captures: [
            {
              id: generateId(),
              text,
              createdAt: new Date().toISOString(),
              processed: false,
            },
            ...state.captures,
          ],
        })),
      processCapture: (id, action) => {
        const state = get();
        const capture = state.captures.find((c) => c.id === id);
        if (!capture) return;

        if (action === 'task') {
          state.addTask({
            title: capture.text,
            priority: 'medium',
            completed: false,
            tags: [],
          });
        } else if (action === 'note') {
          state.addNote({
            title: capture.text.slice(0, 50),
            content: capture.text,
            tags: [],
            pinned: false,
          });
        } else if (action === 'event') {
          state.addEvent({
            title: capture.text,
            date: format(new Date(), 'yyyy-MM-dd'),
            startTime: '09:00',
            type: 'reminder',
            color: '#F59E0B',
          });
        }

        set((state) => ({
          captures: state.captures.map((c) =>
            c.id === id ? { ...c, processed: true, processedAs: action } : c
          ),
        }));
      },
      deleteCapture: (id) =>
        set((state) => ({
          captures: state.captures.filter((c) => c.id !== id),
        })),

      // Mood
      moodEntries: initialMoodEntries,
      logMood: (mood, note) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        set((state) => {
          const existingIndex = state.moodEntries.findIndex((e) => e.date === today);
          if (existingIndex !== -1) {
            const newEntries = [...state.moodEntries];
            newEntries[existingIndex] = { ...newEntries[existingIndex], mood, note };
            return { moodEntries: newEntries };
          }
          return {
            moodEntries: [
              { id: generateId(), date: today, mood, note },
              ...state.moodEntries,
            ],
          };
        });
      },

      // Chat
      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              ...message,
              id: generateId(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      clearChat: () => set({ chatMessages: [] }),

      // Bookmarks
      bookmarks: initialBookmarks,
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [...state.bookmarks, { ...bookmark, id: generateId() }],
        })),
      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      // Goals
      goals: initialGoals,
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            { ...goal, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const milestones = g.milestones?.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            const current = milestones?.filter((m) => m.completed).length || 0;
            return { ...g, milestones, current };
          }),
        })),

      // News
      news: initialNews,
      toggleSaveNews: (id) =>
        set((state) => ({
          news: state.news.map((n) => (n.id === id ? { ...n, saved: !n.saved } : n)),
        })),

      // Weather
      weather: initialWeather,
      setWeather: (weather) => set({ weather }),

      // UI State
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      focusModeActive: false,
      toggleFocusMode: () => set((state) => ({ focusModeActive: !state.focusModeActive })),
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      aiChatOpen: false,
      setAiChatOpen: (open) => set({ aiChatOpen: open }),

      // Data Management
      exportData: () => {
        const state = get();
        return JSON.stringify({
          user: state.user,
          widgets: state.widgets,
          tasks: state.tasks,
          notes: state.notes,
          events: state.events,
          habits: state.habits,
          focusSessions: state.focusSessions,
          moodEntries: state.moodEntries,
          bookmarks: state.bookmarks,
          goals: state.goals,
          timerSettings: state.timerSettings,
        });
      },
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            user: data.user || get().user,
            widgets: data.widgets || get().widgets,
            tasks: data.tasks || get().tasks,
            notes: data.notes || get().notes,
            events: data.events || get().events,
            habits: data.habits || get().habits,
            focusSessions: data.focusSessions || get().focusSessions,
            moodEntries: data.moodEntries || get().moodEntries,
            bookmarks: data.bookmarks || get().bookmarks,
            goals: data.goals || get().goals,
            timerSettings: data.timerSettings || get().timerSettings,
          });
          return true;
        } catch {
          return false;
        }
      },
      resetAllData: () => {
        set({
          user: { name: 'Roberto', timezone: 'Europe/Zurich' },
          widgets: DEFAULT_WIDGETS,
          tasks: initialTasks,
          notes: initialNotes,
          events: initialEvents,
          habits: initialHabits,
          focusSessions: initialFocusSessions,
          moodEntries: initialMoodEntries,
          bookmarks: initialBookmarks,
          goals: initialGoals,
          captures: [],
          chatMessages: [],
          timerState: {
            status: 'idle',
            timeRemaining: DEFAULT_TIMER_SETTINGS.focusDuration * 60,
            currentSession: 1,
            isBreak: false,
          },
          timerSettings: DEFAULT_TIMER_SETTINGS,
        });
      },
    }),
    {
      name: 'secondbrain-storage',
      partialize: (state) => ({
        user: state.user,
        widgets: state.widgets,
        tasks: state.tasks,
        notes: state.notes,
        events: state.events,
        habits: state.habits,
        focusSessions: state.focusSessions,
        moodEntries: state.moodEntries,
        captures: state.captures,
        chatMessages: state.chatMessages,
        bookmarks: state.bookmarks,
        goals: state.goals,
        timerSettings: state.timerSettings,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
