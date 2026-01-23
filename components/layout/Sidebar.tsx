'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  Target,
  MessageSquare,
  Zap,
  Settings,
  Command,
  ChevronLeft,
  ChevronRight,
  Brain,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { APP_VERSION } from '@/lib/constants';

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
];

const toolsNavItems = [
  { id: 'focus', label: 'Focus Mode', icon: Target, action: 'toggleFocusMode' },
  { id: 'ai', label: 'AI Chat', icon: MessageSquare, action: 'openAiChat' },
  { id: 'capture', label: 'Quick Capture', icon: Zap, action: 'openCapture' },
];

const settingsNavItems: Array<
  | { href: string; label: string; icon: typeof Settings; id?: never; action?: never }
  | { id: string; label: string; icon: typeof Command; action: string; href?: never }
> = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { id: 'shortcuts', label: 'Keyboard', icon: Command, action: 'showShortcuts' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, toggleFocusMode, setAiChatOpen, setCommandPaletteOpen, user, focusModeActive } = useStore();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleAction = (action: string) => {
    switch (action) {
      case 'toggleFocusMode':
        toggleFocusMode();
        break;
      case 'openAiChat':
        setAiChatOpen(true);
        break;
      case 'openCapture':
        setCommandPaletteOpen(true);
        break;
      case 'showShortcuts':
        setShowShortcuts(true);
        break;
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-card flex flex-col',
          'hidden md:flex'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <Sparkles className="w-3 h-3 text-indigo-400 absolute -top-1 -right-1" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <span className="font-semibold text-lg">SecondBrain</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {APP_VERSION}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Main */}
          <div>
            {!sidebarCollapsed && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2 block">
                Main
              </span>
            )}
            <ul className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            'sidebar-item',
                            isActive && 'sidebar-item-active',
                            sidebarCollapsed && 'justify-center px-2'
                          )}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tools */}
          <div>
            {!sidebarCollapsed && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2 block">
                Tools
              </span>
            )}
            <ul className="space-y-1">
              {toolsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === 'focus' && focusModeActive;

                return (
                  <li key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleAction(item.action)}
                          className={cn(
                            'sidebar-item w-full',
                            isActive && 'sidebar-item-active',
                            sidebarCollapsed && 'justify-center px-2'
                          )}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          {!sidebarCollapsed && <span>{item.label}</span>}
                          {item.id === 'focus' && focusModeActive && !sidebarCollapsed && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          )}
                        </button>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          {item.label}
                          {item.id === 'focus' && focusModeActive && ' (Active)'}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Settings */}
          <div>
            {!sidebarCollapsed && (
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2 block">
                Settings
              </span>
            )}
            <ul className="space-y-1">
              {settingsNavItems.map((item) => {
                const Icon = item.icon;

                if (item.href) {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'sidebar-item',
                              isActive && 'sidebar-item-active',
                              sidebarCollapsed && 'justify-center px-2'
                            )}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                          </Link>
                        </TooltipTrigger>
                        {sidebarCollapsed && (
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => item.action && handleAction(item.action)}
                          className={cn(
                            'sidebar-item w-full',
                            sidebarCollapsed && 'justify-center px-2'
                          )}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          {!sidebarCollapsed && <span>{item.label}</span>}
                        </button>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t p-3">
          <div className={cn(
            'flex items-center gap-3',
            sidebarCollapsed && 'justify-center'
          )}>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Pro
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'w-full',
              sidebarCollapsed && 'px-2'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
