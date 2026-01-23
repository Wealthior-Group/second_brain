'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Plus,
  Search,
  FileText,
  Pin,
  Trash2,
  Edit2,
  X,
  Tag,
  Eye,
  Code,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/lib/store';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

function NotesPageSkeleton() {
  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        <div className="w-80 shrink-0 flex flex-col">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 border rounded-lg bg-card">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </AppShell>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<NotesPageSkeleton />}>
      <NotesContent />
    </Suspense>
  );
}

function NotesContent() {
  const searchParams = useSearchParams();
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'preview'>('edit');
  const [editingNote, setEditingNote] = useState({
    title: '',
    content: '',
    tags: '',
  });

  // Check for URL params
  useEffect(() => {
    const noteId = searchParams.get('id');
    const isNew = searchParams.get('new');

    if (noteId) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setSelectedNote(note);
      }
    } else if (isNew) {
      handleNewNote();
    }
  }, [searchParams, notes]);

  // Filter and sort notes
  const filteredNotes = notes
    .filter((note) => {
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags.some((t) => t.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      // Then by updated date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleNewNote = () => {
    setSelectedNote(null);
    setIsEditing(true);
    setEditingNote({ title: '', content: '', tags: '' });
    setEditMode('edit');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
    });
    setIsEditing(true);
    setEditMode('edit');
  };

  const handleSaveNote = () => {
    if (!editingNote.title.trim()) return;

    const tags = editingNote.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (selectedNote) {
      updateNote(selectedNote.id, {
        title: editingNote.title.trim(),
        content: editingNote.content,
        tags,
      });
      setSelectedNote({
        ...selectedNote,
        title: editingNote.title.trim(),
        content: editingNote.content,
        tags,
      });
    } else {
      addNote({
        title: editingNote.title.trim(),
        content: editingNote.content,
        tags,
        pinned: false,
      });
    }

    setIsEditing(false);
  };

  const handleTogglePin = (note: Note) => {
    updateNote(note.id, { pinned: !note.pinned });
    if (selectedNote?.id === note.id) {
      setSelectedNote({ ...note, pinned: !note.pinned });
    }
  };

  const handleDeleteNote = (note: Note) => {
    deleteNote(note.id);
    if (selectedNote?.id === note.id) {
      setSelectedNote(null);
    }
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Notes List */}
        <div className="w-80 shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Notes</h1>
            <Button onClick={handleNewNote} size="sm" className="gradient-primary text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="pl-9"
            />
          </div>

          <ScrollArea className="flex-1 -mx-2">
            <div className="px-2 space-y-2">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedNote?.id === note.id
                      ? 'bg-accent border-indigo-500'
                      : 'bg-card hover:bg-accent/50'
                  )}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm truncate">{note.title}</h3>
                    {note.pinned && <Pin className="w-3 h-3 text-indigo-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {note.content.replace(/[#*`\[\]]/g, '').slice(0, 100)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(parseISO(note.updatedAt), { addSuffix: true })}
                    </span>
                    {note.tags.length > 0 && (
                      <div className="flex gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredNotes.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No notes found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Note Content */}
        <div className="flex-1 flex flex-col border rounded-lg bg-card">
          {selectedNote || isEditing ? (
            <>
              {/* Note Header */}
              <div className="flex items-center justify-between p-4 border-b">
                {isEditing ? (
                  <Input
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    placeholder="Note title..."
                    className="text-lg font-medium border-0 p-0 h-auto focus-visible:ring-0"
                  />
                ) : (
                  <h2 className="text-lg font-medium">{selectedNote?.title}</h2>
                )}

                <div className="flex items-center gap-2">
                  {isEditing && (
                    <Tabs value={editMode} onValueChange={(v) => setEditMode(v as 'edit' | 'preview')}>
                      <TabsList className="h-8">
                        <TabsTrigger value="edit" className="text-xs h-6 px-2">
                          <Code className="w-3 h-3 mr-1" />
                          Edit
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="text-xs h-6 px-2">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}

                  {selectedNote && !isEditing && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTogglePin(selectedNote)}
                      >
                        <Pin
                          className={cn(
                            'w-4 h-4',
                            selectedNote.pinned && 'fill-current text-indigo-500'
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditNote(selectedNote)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeleteNote(selectedNote)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {isEditing && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          if (!selectedNote) {
                            setEditingNote({ title: '', content: '', tags: '' });
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveNote}
                        disabled={!editingNote.title.trim()}
                        className="gradient-primary text-white"
                      >
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Note Content */}
              <div className="flex-1 overflow-hidden">
                {isEditing ? (
                  editMode === 'edit' ? (
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) =>
                        setEditingNote({ ...editingNote, content: e.target.value })
                      }
                      placeholder="Write your note here... (Markdown supported)"
                      className="h-full resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm"
                    />
                  ) : (
                    <ScrollArea className="h-full p-4">
                      <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {editingNote.content || '*No content yet*'}
                        </ReactMarkdown>
                      </div>
                    </ScrollArea>
                  )
                ) : (
                  <ScrollArea className="h-full p-4">
                    <div className="markdown-content prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedNote?.content || '*No content*'}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Tags */}
              {isEditing ? (
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={editingNote.tags}
                      onChange={(e) =>
                        setEditingNote({ ...editingNote, tags: e.target.value })
                      }
                      placeholder="Tags (comma separated)"
                      className="border-0 p-0 h-auto focus-visible:ring-0"
                    />
                  </div>
                </div>
              ) : selectedNote?.tags && selectedNote.tags.length > 0 ? (
                <div className="p-4 border-t flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {selectedNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground mb-4">Select a note or create a new one</p>
                <Button onClick={handleNewNote} className="gradient-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
