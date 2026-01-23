'use client';

import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import {
  Search,
  Plus,
  Bell,
  Target,
  Sun,
  Moon,
  Menu,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme: setNextTheme } = useTheme();
  const {
    setCommandPaletteOpen,
    focusModeActive,
    toggleFocusMode,
    weather,
    sidebarCollapsed,
    toggleSidebar,
  } = useStore();

  const today = new Date();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Date */}
        <div className="hidden sm:block">
          <p className="text-sm font-medium">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Weather quick view */}
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{weather.icon}</span>
          <span>{weather.temperature}°C</span>
          <span className="text-muted-foreground/60">
            {weather.location.split(',')[0]}
          </span>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground h-9 px-3"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Search or ask AI...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="pointer-events-none ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Quick Capture */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex"
        >
          <Plus className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-medium">Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs">
                Mark all read
              </Button>
            </div>
            <div className="py-2">
              <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                <span className="font-medium">Task due soon</span>
                <span className="text-sm text-muted-foreground">
                  &quot;Review client proposal&quot; is due in 2 hours
                </span>
                <span className="text-xs text-muted-foreground">10 minutes ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                <span className="font-medium">Habit reminder</span>
                <span className="text-sm text-muted-foreground">
                  Don&apos;t forget to check in your habits today!
                </span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 px-4 py-3">
                <span className="font-medium">Focus session completed</span>
                <span className="text-sm text-muted-foreground">
                  Great job! You completed 3 focus sessions today.
                </span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-indigo-500">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Focus Mode */}
        <Button
          variant={focusModeActive ? 'default' : 'ghost'}
          size="icon"
          onClick={toggleFocusMode}
          className={cn(
            focusModeActive && 'bg-indigo-500 hover:bg-indigo-600'
          )}
        >
          <Target className={cn('w-5 h-5', focusModeActive && 'text-white')} />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNextTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
