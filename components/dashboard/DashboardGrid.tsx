'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';

// Widget imports
import { WelcomeWidget } from '@/components/widgets/WelcomeWidget';
import { AIAssistantWidget } from '@/components/widgets/AIAssistantWidget';
import { TasksWidget } from '@/components/widgets/TasksWidget';
import { CalendarWidget } from '@/components/widgets/CalendarWidget';
import { NotesWidget } from '@/components/widgets/NotesWidget';
import { HabitsWidget } from '@/components/widgets/HabitsWidget';
import { FocusTimerWidget } from '@/components/widgets/FocusTimerWidget';
import { QuickCaptureWidget } from '@/components/widgets/QuickCaptureWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { MoodWidget } from '@/components/widgets/MoodWidget';
import { GoalsWidget } from '@/components/widgets/GoalsWidget';
import { StatsWidget } from '@/components/widgets/StatsWidget';
import { BookmarksWidget } from '@/components/widgets/BookmarksWidget';
import { NewsWidget } from '@/components/widgets/NewsWidget';
import { AddWidgetModal } from './AddWidgetModal';

const widgetComponents: Record<string, React.ComponentType<{ config: WidgetConfig }>> = {
  welcome: WelcomeWidget,
  'ai-assistant': AIAssistantWidget,
  tasks: TasksWidget,
  calendar: CalendarWidget,
  notes: NotesWidget,
  habits: HabitsWidget,
  'focus-timer': FocusTimerWidget,
  'quick-capture': QuickCaptureWidget,
  weather: WeatherWidget,
  mood: MoodWidget,
  goals: GoalsWidget,
  stats: StatsWidget,
  bookmarks: BookmarksWidget,
  news: NewsWidget,
};

export function DashboardGrid() {
  const { widgets, reorderWidgets } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderWidgets(active.id as string, over.id as string);
    }

    setActiveId(null);
  };

  const visibleWidgets = widgets.filter((w) => w.visible);
  const activeWidget = activeId
    ? visibleWidgets.find((w) => w.id === activeId)
    : null;

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map((w) => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[140px]">
            {visibleWidgets.map((widget) => {
              const WidgetComponent = widgetComponents[widget.type];
              if (!WidgetComponent) return null;
              return <WidgetComponent key={widget.id} config={widget} />;
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeWidget && (
            <div className="opacity-80 scale-105 shadow-2xl rounded-xl border bg-card p-4">
              <p className="text-sm font-medium">
                {activeWidget.type.replace('-', ' ')}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Widget Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setAddWidgetOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Widget
        </Button>
      </div>

      <AddWidgetModal open={addWidgetOpen} onOpenChange={setAddWidgetOpen} />
    </div>
  );
}
