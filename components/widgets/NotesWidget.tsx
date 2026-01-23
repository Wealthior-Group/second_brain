'use client';

import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Pin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NotesWidgetProps {
  config: WidgetConfig;
}

export function NotesWidget({ config }: NotesWidgetProps) {
  const { notes, removeWidget, updateWidget } = useStore();
  const [search, setSearch] = useState('');

  // Filter and sort notes
  const filteredNotes = notes
    .filter((n) =>
      search
        ? n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      // Pinned first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      // Then by updated date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 6);

  return (
    <WidgetWrapper
      id={config.id}
      title="Notes"
      icon={<FileText className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <Link href="/notes?new=true">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      }
      noPadding
    >
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="px-3 py-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="h-7 text-xs pl-7"
            />
          </div>
        </div>

        {/* Notes Grid */}
        <ScrollArea className="flex-1 p-3">
          <div className="grid grid-cols-2 gap-2">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/notes?id=${note.id}`}>
                  <div className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer h-full">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="text-xs font-medium truncate flex-1">
                        {note.title}
                      </h4>
                      {note.pinned && (
                        <Pin className="w-3 h-3 text-indigo-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">
                      {note.content.replace(/[#*`\[\]]/g, '').slice(0, 80)}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {formatDistanceToNow(parseISO(note.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {notes.length} notes
          </span>
          <Link href="/notes">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              View all
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </WidgetWrapper>
  );
}
