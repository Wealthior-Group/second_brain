'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  MoreHorizontal,
  RefreshCw,
  Maximize2,
  Minimize2,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { WidgetSize, WIDGET_SIZES } from '@/types';

interface WidgetWrapperProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  size: WidgetSize;
  children: React.ReactNode;
  onRemove?: () => void;
  onResize?: (size: WidgetSize) => void;
  headerActions?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onRefresh?: () => void;
}

export function WidgetWrapper({
  id,
  title,
  icon,
  size,
  children,
  onRemove,
  onResize,
  headerActions,
  isLoading,
  isEmpty,
  emptyMessage = 'No data to display',
  emptyIcon,
  className,
  noPadding = false,
  onRefresh,
}: WidgetWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const colSpan = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    6: 'col-span-6',
    8: 'col-span-8',
    12: 'col-span-12',
  }[size.cols];

  const rowSpan = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  }[size.rows];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        colSpan,
        rowSpan,
        'widget-card relative flex flex-col overflow-hidden',
        isDragging && 'dragging z-50',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className={cn(
              'cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-accent transition-opacity',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-muted-foreground shrink-0">{icon}</div>
            <h3 className="font-medium text-sm truncate">{title}</h3>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {headerActions}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-7 w-7 transition-opacity',
                  isHovered ? 'opacity-100' : 'opacity-0'
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onRefresh && (
                <DropdownMenuItem onClick={onRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
              )}

              {onResize && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onResize(WIDGET_SIZES.small)}>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Small
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onResize(WIDGET_SIZES.medium)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onResize(WIDGET_SIZES.large)}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Large
                  </DropdownMenuItem>
                </>
              )}

              {onRemove && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onRemove}
                    className="text-red-500 focus:text-red-500"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className={cn('flex-1 overflow-auto', !noPadding && 'p-4')}>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            {emptyIcon && (
              <div className="text-muted-foreground/50 mb-3">{emptyIcon}</div>
            )}
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
