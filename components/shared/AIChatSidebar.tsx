'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Send, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/lib/store';
import { chat, generateMockResponse } from '@/lib/ai';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const quickPrompts = [
  { label: 'Summarize day', prompt: 'Summarize my day' },
  { label: 'What next?', prompt: 'What should I focus on next?' },
  { label: 'Review tasks', prompt: 'Show me my tasks' },
  { label: 'Productivity tips', prompt: 'Give me a productivity tip' },
];

export function AIChatSidebar() {
  const {
    aiChatOpen,
    setAiChatOpen,
    chatMessages,
    addChatMessage,
    clearChat,
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Focus input when opened
  useEffect(() => {
    if (aiChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [aiChatOpen]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || isLoading) return;

    // Add user message
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

  return (
    <AnimatePresence>
      {aiChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAiChatOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 md:bg-transparent"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-background shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Assistant</h2>
                  <p className="text-xs text-muted-foreground">
                    Powered by your data
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="text-muted-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAiChatOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Hi {user.name}! How can I help?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    I have access to your tasks, notes, calendar, and habits. Ask me anything!
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
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%]',
                          message.role === 'user'
                            ? 'chat-message-user'
                            : 'chat-message-assistant'
                        )}
                      >
                        {message.role === 'assistant' ? (
                          <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <p
                          className={cn(
                            'text-[10px] mt-1',
                            message.role === 'user'
                              ? 'text-white/70'
                              : 'text-muted-foreground'
                          )}
                        >
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="chat-message-assistant flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Quick prompts (when there are messages) */}
            {chatMessages.length > 0 && (
              <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(prompt.prompt)}
                    className="text-xs shrink-0"
                    disabled={isLoading}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="gradient-primary text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
