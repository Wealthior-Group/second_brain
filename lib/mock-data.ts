import { format, subDays, subHours, addDays } from 'date-fns';
import {
  Task,
  CalendarEvent,
  Note,
  Habit,
  FocusSession,
  MoodEntry,
  Bookmark,
  Goal,
  NewsItem,
  Weather,
} from '@/types';

// Helper to generate realistic habit history
function generateHabitHistory(days: number, completionRate: number): string[] {
  const dates: string[] = [];
  for (let i = days; i >= 0; i--) {
    if (Math.random() < completionRate) {
      dates.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
    }
  }
  return dates;
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review client proposal',
    description: 'Go through the proposal document and prepare feedback for tomorrow\'s meeting',
    priority: 'high',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '14:00',
    completed: false,
    tags: ['work', 'client'],
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '2',
    title: 'Call with design team',
    description: 'Discuss the new dashboard mockups',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    dueTime: '16:00',
    completed: false,
    tags: ['work', 'meeting'],
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '3',
    title: 'Prepare meeting notes',
    description: 'Summarize key points from the kickoff meeting',
    priority: 'low',
    completed: true,
    completedAt: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
    tags: ['work'],
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '4',
    title: 'Update portfolio website',
    description: 'Add new case studies and refresh the design',
    priority: 'medium',
    dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    completed: false,
    tags: ['personal', 'dev'],
    createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '5',
    title: 'Research AI tools for automation',
    description: 'Find tools to automate repetitive tasks',
    priority: 'low',
    completed: false,
    tags: ['research'],
    createdAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '6',
    title: 'Send invoice to client',
    description: 'Invoice for December work',
    priority: 'high',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    completed: false,
    tags: ['work', 'finance'],
    createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '7',
    title: 'Book dentist appointment',
    description: 'Annual checkup',
    priority: 'low',
    completed: false,
    tags: ['personal', 'health'],
    createdAt: format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

export const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '10:30',
    type: 'meeting',
    color: '#6366F1',
  },
  {
    id: '2',
    title: 'Client Call - Acme Corp',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '15:00',
    type: 'meeting',
    color: '#22C55E',
  },
  {
    id: '3',
    title: 'Design Review',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '16:00',
    endTime: '17:00',
    type: 'meeting',
    color: '#F59E0B',
  },
  {
    id: '4',
    title: 'Focus Time - Deep Work',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '12:00',
    type: 'focus',
    color: '#EC4899',
  },
  {
    id: '5',
    title: 'Weekly Planning',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '15:00',
    type: 'meeting',
    color: '#6366F1',
  },
  {
    id: '6',
    title: 'Product Demo',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    type: 'meeting',
    color: '#22C55E',
  },
];

export const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Project Ideas',
    content: `# Project Ideas for Q1 2025

## AI-Powered Tools
- Content generator for social media
- Meeting summarizer
- Code review assistant

## Client Projects
- E-commerce redesign for Fashion Brand
- Dashboard for SaaS startup

## Personal
- Update portfolio with new case studies
- Write blog post about AI development`,
    tags: ['ideas', 'projects'],
    pinned: true,
    createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '2',
    title: 'Meeting Notes - Client Kickoff',
    content: `# Client Kickoff Meeting

**Date:** ${format(subDays(new Date(), 2), 'MMMM d, yyyy')}
**Attendees:** Roberto, Sarah (Client), Mike (Design)

## Key Points
- Timeline: 8 weeks
- Budget: Approved
- Main deliverable: Full website redesign

## Action Items
- [ ] Send proposal by Friday
- [ ] Schedule design workshop
- [ ] Share brand guidelines`,
    tags: ['meeting', 'client'],
    pinned: false,
    createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '3',
    title: 'Learning Resources',
    content: `# Resources to Check Out

## Courses
- [x] Advanced TypeScript Patterns
- [ ] System Design for Frontend
- [ ] AI/ML Fundamentals

## Books
- "Clean Code" by Robert Martin
- "Designing Data-Intensive Applications"

## Podcasts
- Syntax.fm
- The Changelog`,
    tags: ['learning', 'resources'],
    pinned: false,
    createdAt: format(subDays(new Date(), 10), "yyyy-MM-dd'T'HH:mm:ss"),
    updatedAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

export const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Exercise',
    emoji: '🏃',
    frequency: 'daily',
    completedDates: generateHabitHistory(14, 0.8),
    currentStreak: 5,
    longestStreak: 14,
    createdAt: format(subDays(new Date(), 30), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '2',
    name: 'Read',
    emoji: '📚',
    frequency: 'daily',
    completedDates: generateHabitHistory(14, 0.7),
    currentStreak: 3,
    longestStreak: 21,
    createdAt: format(subDays(new Date(), 60), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '3',
    name: 'Meditate',
    emoji: '🧘',
    frequency: 'daily',
    completedDates: generateHabitHistory(14, 0.5),
    currentStreak: 2,
    longestStreak: 7,
    createdAt: format(subDays(new Date(), 20), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '4',
    name: 'Drink Water',
    emoji: '💧',
    frequency: 'daily',
    completedDates: generateHabitHistory(14, 0.9),
    currentStreak: 12,
    longestStreak: 30,
    createdAt: format(subDays(new Date(), 45), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '5',
    name: 'Sleep 7+ Hours',
    emoji: '😴',
    frequency: 'daily',
    completedDates: generateHabitHistory(14, 0.6),
    currentStreak: 1,
    longestStreak: 10,
    createdAt: format(subDays(new Date(), 15), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

export const initialFocusSessions: FocusSession[] = [
  {
    id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subHours(new Date(), 3).toISOString(),
  },
  {
    id: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subHours(new Date(), 2).toISOString(),
  },
  {
    id: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subHours(new Date(), 1).toISOString(),
  },
  {
    id: '4',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: '5',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: '6',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '7',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '8',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '9',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: '10',
    date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 4).toISOString(),
  },
  {
    id: '11',
    date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 4).toISOString(),
  },
  {
    id: '12',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: '13',
    date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 6).toISOString(),
  },
  {
    id: '14',
    date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    duration: 25,
    completedAt: subDays(new Date(), 6).toISOString(),
  },
];

export const initialMoodEntries: MoodEntry[] = [
  { id: '1', date: format(subDays(new Date(), 6), 'yyyy-MM-dd'), mood: 4 },
  { id: '2', date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), mood: 4 },
  { id: '3', date: format(subDays(new Date(), 4), 'yyyy-MM-dd'), mood: 5 },
  { id: '4', date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), mood: 3 },
  { id: '5', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), mood: 5 },
  { id: '6', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), mood: 4 },
];

export const initialBookmarks: Bookmark[] = [
  { id: '1', title: 'Gmail', url: 'https://mail.google.com', icon: '📧', category: 'productivity' },
  { id: '2', title: 'GitHub', url: 'https://github.com', icon: '🐙', category: 'development' },
  { id: '3', title: 'Analytics', url: 'https://analytics.google.com', icon: '📊', category: 'work' },
  { id: '4', title: 'Notion', url: 'https://notion.so', icon: '📝', category: 'productivity' },
  { id: '5', title: 'Figma', url: 'https://figma.com', icon: '🎨', category: 'design' },
  { id: '6', title: 'Calendar', url: 'https://calendar.google.com', icon: '📅', category: 'productivity' },
];

export const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Launch new product',
    description: 'Complete MVP and launch to first customers',
    target: 5,
    current: 3,
    unit: 'milestones',
    category: 'work',
    quarter: 'Q4 2024',
    milestones: [
      { id: '1-1', title: 'Complete design', completed: true },
      { id: '1-2', title: 'Build MVP', completed: true },
      { id: '1-3', title: 'Beta testing', completed: true },
      { id: '1-4', title: 'Marketing prep', completed: false },
      { id: '1-5', title: 'Launch', completed: false },
    ],
    createdAt: format(subDays(new Date(), 60), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '2',
    title: 'Reach 1000 subscribers',
    description: 'Grow newsletter to 1000 subscribers',
    target: 1000,
    current: 890,
    unit: 'subscribers',
    category: 'growth',
    quarter: 'Q4 2024',
    createdAt: format(subDays(new Date(), 90), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '3',
    title: 'Read 12 books',
    description: 'Read one book per month',
    target: 12,
    current: 9,
    unit: 'books',
    category: 'personal',
    quarter: '2024',
    createdAt: format(subDays(new Date(), 300), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

export const initialNews: NewsItem[] = [
  {
    id: '1',
    title: 'OpenAI announces major breakthrough in reasoning capabilities',
    source: 'TechCrunch',
    url: '#',
    publishedAt: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
    category: 'tech',
    trending: true,
  },
  {
    id: '2',
    title: 'Swiss startup raises $50M for AI-powered healthcare',
    source: 'Handelszeitung',
    url: '#',
    publishedAt: format(subHours(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
    category: 'business',
    trending: true,
  },
  {
    id: '3',
    title: 'Next.js 15 released with major performance improvements',
    source: 'Vercel Blog',
    url: '#',
    publishedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
    category: 'tech',
  },
  {
    id: '4',
    title: 'Remote work trends continue to reshape tech industry',
    source: 'The Verge',
    url: '#',
    publishedAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
    category: 'tech',
  },
  {
    id: '5',
    title: 'New study shows productivity gains from AI assistants',
    source: 'MIT Tech Review',
    url: '#',
    publishedAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
    category: 'research',
  },
];

export const initialWeather: Weather = {
  location: 'Zürich, Switzerland',
  temperature: 12,
  condition: 'Sunny',
  icon: '☀️',
  high: 14,
  low: 8,
  feelsLike: 10,
  forecast: [
    { day: 'Fri', icon: '☀️', high: 12, low: 8 },
    { day: 'Sat', icon: '⛅', high: 10, low: 6 },
    { day: 'Sun', icon: '🌧️', high: 8, low: 5 },
    { day: 'Mon', icon: '☀️', high: 11, low: 7 },
  ],
};
