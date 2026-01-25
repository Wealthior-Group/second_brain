'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { AIChatSidebar } from '@/components/shared/AIChatSidebar';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, aiChatOpen, focusModeActive, toggleFocusMode } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle key press to dismiss Focus Mode
  useEffect(() => {
    if (!focusModeActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleFocusMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusModeActive, toggleFocusMode]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusModeActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 cursor-pointer"
            onClick={toggleFocusMode}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-full text-sm font-medium shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Focus Mode Active
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-200',
          sidebarCollapsed ? 'md:pl-16' : 'md:pl-60'
        )}
      >
        <Header />
        <main className="p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette />

      {/* AI Chat Sidebar */}
      <AIChatSidebar />

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}

function MobileNavigation() {
  const { setCommandPaletteOpen, toggleFocusMode, focusModeActive } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around h-16">
        <NavButton href="/" icon="🏠" label="Home" />
        <NavButton href="/tasks" icon="✓" label="Tasks" />
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex flex-col items-center justify-center w-14 h-14 -mt-4 rounded-full gradient-primary text-white shadow-lg"
        >
          <span className="text-xl">+</span>
        </button>
        <NavButton href="/notes" icon="📝" label="Notes" />
        <button
          onClick={toggleFocusMode}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-muted-foreground",
            focusModeActive && "text-indigo-500"
          )}
        >
          <span className="text-lg">🎯</span>
          <span className="text-[10px]">Focus</span>
        </button>
      </div>
    </nav>
  );
}

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 px-3 py-2",
        isActive ? "text-indigo-500" : "text-muted-foreground"
      )}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </Link>
  );
}
