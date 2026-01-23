'use client';

import {
  Brain,
  Calendar,
  CheckSquare,
  Cloud,
  FileText,
  Link,
  Newspaper,
  Smile,
  Sunrise,
  Target,
  Timer,
  Zap,
  BarChart3,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { WidgetType } from '@/types';
import { WIDGET_REGISTRY } from '@/lib/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  Brain,
  CheckSquare,
  Calendar,
  FileText,
  Target,
  Timer,
  Zap,
  Newspaper,
  Cloud,
  Link,
  Smile,
  BarChart3,
};

interface AddWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWidgetModal({ open, onOpenChange }: AddWidgetModalProps) {
  const { widgets, addWidget } = useStore();

  const existingTypes = widgets.map((w) => w.type);

  const handleAddWidget = (type: WidgetType) => {
    addWidget(type);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a widget to add to your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {(Object.entries(WIDGET_REGISTRY) as [WidgetType, typeof WIDGET_REGISTRY[WidgetType]][]).map(
            ([type, config]) => {
              const Icon = iconMap[config.icon] || Target;
              const isAdded = existingTypes.includes(type);

              return (
                <Button
                  key={type}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 text-left"
                  onClick={() => handleAddWidget(type)}
                  disabled={isAdded}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="p-2 rounded-lg bg-accent">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">{config.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {config.description}
                  </p>
                  {isAdded && (
                    <span className="text-xs text-indigo-500">Already added</span>
                  )}
                </Button>
              );
            }
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
