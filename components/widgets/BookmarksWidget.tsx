'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';

interface BookmarksWidgetProps {
  config: WidgetConfig;
}

export function BookmarksWidget({ config }: BookmarksWidgetProps) {
  const { bookmarks, addBookmark, deleteBookmark, removeWidget, updateWidget } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', icon: '' });

  const handleAddBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;

    addBookmark({
      title: newBookmark.title.trim(),
      url: newBookmark.url.trim(),
      icon: newBookmark.icon.trim() || '🔗',
    });

    setNewBookmark({ title: '', url: '', icon: '' });
    setIsAddOpen(false);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <WidgetWrapper
      id={config.id}
      title="Quick Links"
      icon={<Link className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bookmark</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newBookmark.title}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, title: e.target.value })
                  }
                  placeholder="GitHub"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={newBookmark.url}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, url: e.target.value })
                  }
                  placeholder="https://github.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon (emoji)</label>
                <Input
                  value={newBookmark.icon}
                  onChange={(e) =>
                    setNewBookmark({ ...newBookmark, icon: e.target.value })
                  }
                  placeholder="🐙"
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleAddBookmark}
                disabled={!newBookmark.title.trim() || !newBookmark.url.trim()}
                className="w-full gradient-primary text-white"
              >
                Add Bookmark
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
      noPadding
    >
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {bookmarks.slice(0, 6).map((bookmark, index) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openLink(bookmark.url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLink(bookmark.url)}
              className="group relative flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <span className="text-2xl">{bookmark.icon || '🔗'}</span>
              <span className="text-xs truncate w-full text-center">
                {bookmark.title}
              </span>

              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBookmark(bookmark.id);
                }}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-background border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </WidgetWrapper>
  );
}
