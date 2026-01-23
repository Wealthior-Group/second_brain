// SecondBrain Type Definitions

export interface User {
  name: string;
  avatar?: string;
  timezone: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  dueTime?: string;
  completed: boolean;
  completedAt?: string;
  tags: string[];
  aiSuggested?: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  type: 'meeting' | 'task' | 'reminder' | 'focus';
  color: string;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number[];
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  date: string;
  duration: number;
  completedAt: string;
  taskId?: string;
}

export interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'break' | 'completed';
  timeRemaining: number;
  currentSession: number;
  isBreak: boolean;
  linkedTaskId?: string;
}

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export interface Capture {
  id: string;
  text: string;
  createdAt: string;
  processed: boolean;
  processedAs?: 'task' | 'note' | 'event' | 'dismiss';
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  category?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  category?: string;
  quarter?: string;
  milestones?: GoalMilestone[];
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  trending?: boolean;
  saved?: boolean;
}

export interface Weather {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  feelsLike: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  day: string;
  icon: string;
  high: number;
  low: number;
}

export type WidgetSize = {
  cols: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  rows: 1 | 2 | 3 | 4;
};

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  position: number;
  visible: boolean;
  settings?: Record<string, unknown>;
}

export type WidgetType =
  | 'welcome'
  | 'ai-assistant'
  | 'tasks'
  | 'calendar'
  | 'notes'
  | 'habits'
  | 'focus-timer'
  | 'quick-capture'
  | 'news'
  | 'weather'
  | 'bookmarks'
  | 'goals'
  | 'mood'
  | 'stats';

export interface WidgetLayout {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const WIDGET_SIZES = {
  small: { cols: 3 as const, rows: 2 as const },
  medium: { cols: 4 as const, rows: 2 as const },
  large: { cols: 6 as const, rows: 2 as const },
  wide: { cols: 8 as const, rows: 2 as const },
  full: { cols: 12 as const, rows: 2 as const },
  tall: { cols: 4 as const, rows: 3 as const },
  hero: { cols: 6 as const, rows: 3 as const },
};

export interface SecondBrainContext {
  tasks: Task[];
  events: CalendarEvent[];
  notes: Note[];
  habits: Habit[];
  focusSessions: FocusSession[];
  mood: MoodEntry[];
  currentTime: string;
  userName: string;
}
