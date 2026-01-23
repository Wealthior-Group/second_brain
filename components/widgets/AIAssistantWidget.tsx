'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Brain, Send, Loader2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';
import { chat } from '@/lib/ai';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AIAssistantWidgetProps {
  config: WidgetConfig;
}

const quickPrompts = [
  { label: 'Summarize day', prompt: 'Summarize my day' },
  { label: 'Next task', prompt: 'What should I focus on?' },
  { label: 'Ideas', prompt: 'Give me productivity tips' },
];

export function AIAssistantWidget({ config }: AIAssistantWidgetProps) {
  const {
    removeWidget,
    updateWidget,
    setAiChatOpen,
    chatMessages,
    addChatMessage,
    tasks,
    events,
    notes,
    habits,
    focusSessions,
    moodEntries,
    user,
  } = useStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || isLoading) return;

    addChatMessage({ role: 'user', content: text });
    setInput('');
    setIsLoading(true);

    try {
      const context = {
        tasks,
        events,
        notes,
        habits,
        focusSessions,
        mood: moodEntries,
        currentTime: new Date().toISOString(),
        userName: user.name,
      };

      const response = await chat(
        [...chatMessages, { id: 'temp', role: 'user' as const, content: text, timestamp: new Date().toISOString() }],
        context
      );

      addChatMessage({ role: 'assistant', content: response });
    } catch (error) {
      console.error('Chat error:', error);
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const recentMessages = chatMessages.slice(-6);

  return (
    <WidgetWrapper
      id={config.id}
      title="AI Assistant"
      icon={<Brain className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      headerActions={
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setAiChatOpen(true)}
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      }
      noPadding
    >
      <div className="flex flex-col h-full">
        {/* Messages */}
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          {recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Ask me anything about your tasks, habits, or productivity!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(prompt.prompt)}
                    className="text-xs"
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] text-sm',
                      message.role === 'user'
                        ? 'chat-message-user'
                        : 'chat-message-assistant'
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="markdown-content prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-message-assistant flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Quick prompts */}
        {recentMessages.length > 0 && (
          <div className="px-3 py-2 border-t flex gap-1.5 overflow-x-auto">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                onClick={() => handleSend(prompt.prompt)}
                className="text-xs shrink-0 h-7 px-2"
                disabled={isLoading}
              >
                {prompt.label}
              </Button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 h-8 text-sm"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="gradient-primary text-white h-8 w-8 p-0"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
}
