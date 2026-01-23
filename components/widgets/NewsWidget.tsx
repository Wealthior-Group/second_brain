'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Newspaper, Bookmark, ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { cn } from '@/lib/utils';

interface NewsWidgetProps {
  config: WidgetConfig;
}

export function NewsWidget({ config }: NewsWidgetProps) {
  const { news, toggleSaveNews, removeWidget, updateWidget } = useStore();

  return (
    <WidgetWrapper
      id={config.id}
      title="AI News Feed"
      icon={<Newspaper className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <span className="text-xs text-muted-foreground">Personalized</span>
      }
      noPadding
    >
      <ScrollArea className="h-full">
        <div className="p-3 space-y-2">
          {news.slice(0, 5).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.trending && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                        <TrendingUp className="w-2.5 h-2.5" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-sm font-medium line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(parseISO(item.publishedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleSaveNews(item.id)}
                  >
                    <Bookmark
                      className={cn(
                        'w-3.5 h-3.5',
                        item.saved && 'fill-current text-indigo-500'
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </WidgetWrapper>
  );
}
