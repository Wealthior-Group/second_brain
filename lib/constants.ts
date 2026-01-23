import { WidgetType, WidgetConfig, WIDGET_SIZES } from '@/types';

export const APP_NAME = 'SecondBrain';
export const APP_VERSION = 'v1.0';
export const APP_AUTHOR = 'Roberto Mazzotta';

export const KEYBOARD_SHORTCUTS = {
  'cmd+k': 'Open command palette',
  'cmd+n': 'New task',
  'cmd+shift+n': 'New note',
  'cmd+.': 'Toggle focus mode',
  'cmd+/': 'Show keyboard shortcuts',
  'cmd+,': 'Open settings',
  'g d': 'Go to dashboard',
  'g t': 'Go to tasks',
  'g n': 'Go to notes',
  'g c': 'Go to calendar',
  'space': 'Start/pause timer (when focused)',
  'r': 'Reset timer',
  'cmd+enter': 'Save task',
  'e': 'Edit selected task',
  'del': 'Delete selected task',
  'cmd+j': 'Open AI chat',
} as const;

export const DEFAULT_TIMER_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

export const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
} as const;

export const EVENT_COLORS = {
  meeting: '#6366F1',
  task: '#22C55E',
  reminder: '#F59E0B',
  focus: '#EC4899',
} as const;

export const MOOD_EMOJIS = ['😫', '😕', '😐', '🙂', '😄'] as const;

export const WIDGET_REGISTRY: Record<WidgetType, { name: string; icon: string; description: string; defaultSize: keyof typeof WIDGET_SIZES }> = {
  welcome: {
    name: 'Welcome',
    icon: 'Sunrise',
    description: 'Personalized greeting with daily overview',
    defaultSize: 'large',
  },
  'ai-assistant': {
    name: 'AI Assistant',
    icon: 'Brain',
    description: 'Chat with AI about your tasks and productivity',
    defaultSize: 'medium',
  },
  tasks: {
    name: 'Tasks',
    icon: 'CheckSquare',
    description: 'Manage your to-do list',
    defaultSize: 'medium',
  },
  calendar: {
    name: 'Calendar',
    icon: 'Calendar',
    description: 'View your schedule',
    defaultSize: 'medium',
  },
  notes: {
    name: 'Notes',
    icon: 'FileText',
    description: 'Quick notes and ideas',
    defaultSize: 'medium',
  },
  habits: {
    name: 'Habits',
    icon: 'Target',
    description: 'Track daily habits',
    defaultSize: 'medium',
  },
  'focus-timer': {
    name: 'Focus Timer',
    icon: 'Timer',
    description: 'Pomodoro-style focus sessions',
    defaultSize: 'small',
  },
  'quick-capture': {
    name: 'Quick Capture',
    icon: 'Zap',
    description: 'Capture thoughts instantly',
    defaultSize: 'small',
  },
  news: {
    name: 'News Feed',
    icon: 'Newspaper',
    description: 'AI-curated news articles',
    defaultSize: 'medium',
  },
  weather: {
    name: 'Weather',
    icon: 'Cloud',
    description: 'Local weather forecast',
    defaultSize: 'small',
  },
  bookmarks: {
    name: 'Quick Links',
    icon: 'Link',
    description: 'Frequently used links',
    defaultSize: 'small',
  },
  goals: {
    name: 'Goals',
    icon: 'Target',
    description: 'Track your quarterly goals',
    defaultSize: 'medium',
  },
  mood: {
    name: 'Mood',
    icon: 'Smile',
    description: 'Daily mood tracking',
    defaultSize: 'small',
  },
  stats: {
    name: 'Stats',
    icon: 'BarChart3',
    description: 'Productivity statistics',
    defaultSize: 'medium',
  },
};

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'welcome-1', type: 'welcome', size: WIDGET_SIZES.large, position: 0, visible: true },
  { id: 'ai-1', type: 'ai-assistant', size: WIDGET_SIZES.large, position: 1, visible: true },
  { id: 'tasks-1', type: 'tasks', size: WIDGET_SIZES.tall, position: 2, visible: true },
  { id: 'calendar-1', type: 'calendar', size: WIDGET_SIZES.tall, position: 3, visible: true },
  { id: 'habits-1', type: 'habits', size: WIDGET_SIZES.tall, position: 4, visible: true },
  { id: 'focus-1', type: 'focus-timer', size: WIDGET_SIZES.small, position: 5, visible: true },
  { id: 'notes-1', type: 'notes', size: WIDGET_SIZES.tall, position: 6, visible: true },
  { id: 'capture-1', type: 'quick-capture', size: WIDGET_SIZES.small, position: 7, visible: true },
  { id: 'weather-1', type: 'weather', size: WIDGET_SIZES.small, position: 8, visible: true },
  { id: 'mood-1', type: 'mood', size: WIDGET_SIZES.small, position: 9, visible: true },
  { id: 'goals-1', type: 'goals', size: WIDGET_SIZES.tall, position: 10, visible: true },
  { id: 'stats-1', type: 'stats', size: WIDGET_SIZES.medium, position: 11, visible: true },
  { id: 'bookmarks-1', type: 'bookmarks', size: WIDGET_SIZES.small, position: 12, visible: true },
  { id: 'news-1', type: 'news', size: WIDGET_SIZES.tall, position: 13, visible: true },
];

export const GREETINGS = {
  morning: 'Good morning',
  afternoon: 'Good afternoon',
  evening: 'Good evening',
  night: 'Good night',
} as const;

export const AI_INSIGHTS = [
  "You're most productive on Fridays. Consider tackling your hardest task now.",
  "You've completed 80% of your tasks this week. Great momentum!",
  "Your focus time has increased by 23% compared to last week.",
  "You haven't taken a break in a while. Consider a 5-minute stretch.",
  "Your habit streak is at risk. Don't forget to check in today!",
  "You have 3 high-priority tasks due today. Start with the most impactful one.",
  "Based on your patterns, you're most focused between 9-11 AM.",
  "You've been crushing your goals this quarter. Keep it up!",
];
