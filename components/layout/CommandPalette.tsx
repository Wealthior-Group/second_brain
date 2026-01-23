'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FileText,
  Timer,
  Zap,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  Brain,
  Sparkles,
  ListTodo,
  StickyNote,
  Search,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useStore } from '@/lib/store';

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    toggleFocusMode,
    setAiChatOpen,
    addTask,
    tasks,
    notes,
  } = useStore();
  const [search, setSearch] = useState('');

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false);
      command();
    },
    [setCommandPaletteOpen]
  );

  // Quick actions
  const quickActions = [
    {
      icon: Plus,
      label: 'New Task',
      shortcut: '⌘N',
      action: () => {
        const title = search.trim() || 'New Task';
        addTask({
          title,
          priority: 'medium',
          completed: false,
          tags: [],
        });
        setSearch('');
      },
    },
    {
      icon: StickyNote,
      label: 'New Note',
      shortcut: '⌘⇧N',
      action: () => router.push('/notes?new=true'),
    },
    {
      icon: Timer,
      label: 'Start Focus Session',
      shortcut: '⌘.',
      action: () => toggleFocusMode(),
    },
    {
      icon: Zap,
      label: 'Quick Capture',
      action: () => {
        if (search.trim()) {
          addTask({
            title: search.trim(),
            priority: 'medium',
            completed: false,
            tags: [],
          });
          setSearch('');
        }
      },
    },
  ];

  // Navigation
  const navigation = [
    { icon: LayoutDashboard, label: 'Go to Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Go to Tasks', path: '/tasks' },
    { icon: FileText, label: 'Go to Notes', path: '/notes' },
    { icon: Calendar, label: 'Go to Calendar', path: '/calendar' },
    { icon: Settings, label: 'Go to Settings', path: '/settings' },
  ];

  // AI Commands
  const aiCommands = [
    { icon: Brain, label: 'Ask AI anything...', action: () => setAiChatOpen(true) },
    {
      icon: Sparkles,
      label: 'Summarize my day',
      action: () => {
        setAiChatOpen(true);
        // The AI chat will handle this
      },
    },
    {
      icon: ListTodo,
      label: 'What should I focus on?',
      action: () => {
        setAiChatOpen(true);
      },
    },
  ];

  // Recent items
  const recentTasks = tasks.slice(0, 3);
  const recentNotes = notes.slice(0, 2);

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <Search className="w-10 h-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No results found.</p>
            {search.trim() && (
              <p className="text-xs text-muted-foreground">
                Press Enter to create &quot;{search}&quot; as a task
              </p>
            )}
          </div>
        </CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.label}
              onSelect={() => runCommand(action.action)}
              className="gap-3"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
              {action.shortcut && (
                <kbd className="ml-auto text-xs text-muted-foreground">
                  {action.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          {navigation.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => runCommand(() => router.push(item.path))}
              className="gap-3"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* AI Commands */}
        <CommandGroup heading="AI Commands">
          {aiCommands.map((cmd) => (
            <CommandItem
              key={cmd.label}
              onSelect={() => runCommand(cmd.action)}
              className="gap-3"
            >
              <cmd.icon className="w-4 h-4 text-indigo-500" />
              <span>{cmd.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Recent */}
        <CommandGroup heading="Recent Tasks">
          {recentTasks.map((task) => (
            <CommandItem
              key={task.id}
              onSelect={() => runCommand(() => router.push('/tasks'))}
              className="gap-3"
            >
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
              <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </span>
              {task.priority === 'high' && (
                <span className="ml-auto text-xs text-red-500">High</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Recent Notes">
          {recentNotes.map((note) => (
            <CommandItem
              key={note.id}
              onSelect={() => runCommand(() => router.push('/notes'))}
              className="gap-3"
            >
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span>{note.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
