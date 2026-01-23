'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, CheckSquare, FileText, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { analyzeCapture } from '@/lib/ai';
import { cn } from '@/lib/utils';

interface QuickCaptureWidgetProps {
  config: WidgetConfig;
}

export function QuickCaptureWidget({ config }: QuickCaptureWidgetProps) {
  const {
    addCapture,
    processCapture,
    captures,
    removeWidget,
    updateWidget,
  } = useStore();

  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState<{
    id: string;
    type: 'task' | 'note' | 'event' | 'unknown';
    text: string;
  } | null>(null);

  const handleCapture = () => {
    if (!input.trim()) return;

    const text = input.trim();
    const type = analyzeCapture(text);

    // Add to captures
    addCapture(text);

    // Get the latest capture ID
    const captureId = captures[0]?.id || 'temp';

    // Show suggestion
    setSuggestion({ id: captureId, type, text });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCapture();
    }
  };

  const handleProcess = (action: 'task' | 'note' | 'event' | 'dismiss') => {
    if (suggestion) {
      // Find the actual capture
      const capture = captures.find((c) => c.text === suggestion.text);
      if (capture) {
        processCapture(capture.id, action);
      }
    }
    setSuggestion(null);
  };

  const lastCapture = captures.find((c) => !c.processed);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-3 h-3" />;
      case 'note':
        return <FileText className="w-3 h-3" />;
      case 'event':
        return <Calendar className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task':
        return 'Looks like a task';
      case 'note':
        return 'Looks like a note';
      case 'event':
        return 'Looks like an event';
      default:
        return 'What is this?';
    }
  };

  return (
    <WidgetWrapper
      id={config.id}
      title="Quick Capture"
      icon={<Zap className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      noPadding
    >
      <div className="flex flex-col h-full p-4">
        {/* Input */}
        <div className="flex gap-2 mb-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Capture a thought..."
            className="flex-1 h-9 text-sm"
          />
          <Button
            onClick={handleCapture}
            disabled={!input.trim()}
            size="icon"
            className="h-9 w-9 gradient-primary text-white"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Suggestion */}
        <AnimatePresence mode="wait">
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg border bg-accent/50"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTypeIcon(suggestion.type)}
                  <span>{getTypeLabel(suggestion.type)}</span>
                </div>
                <button
                  onClick={() => setSuggestion(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm mb-3 truncate">&quot;{suggestion.text}&quot;</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={suggestion.type === 'task' ? 'default' : 'outline'}
                  className={cn(
                    'text-xs h-7 flex-1',
                    suggestion.type === 'task' && 'gradient-primary text-white'
                  )}
                  onClick={() => handleProcess('task')}
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Task
                </Button>
                <Button
                  size="sm"
                  variant={suggestion.type === 'note' ? 'default' : 'outline'}
                  className={cn(
                    'text-xs h-7 flex-1',
                    suggestion.type === 'note' && 'gradient-primary text-white'
                  )}
                  onClick={() => handleProcess('note')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Note
                </Button>
                <Button
                  size="sm"
                  variant={suggestion.type === 'event' ? 'default' : 'outline'}
                  className={cn(
                    'text-xs h-7 flex-1',
                    suggestion.type === 'event' && 'gradient-primary text-white'
                  )}
                  onClick={() => handleProcess('event')}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Event
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last capture */}
        {!suggestion && lastCapture && (
          <div className="mt-auto pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Recent: &quot;{lastCapture.text.slice(0, 40)}
              {lastCapture.text.length > 40 ? '...' : ''}&quot;
            </p>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
}
