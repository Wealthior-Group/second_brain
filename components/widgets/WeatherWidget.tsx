'use client';

import { Cloud } from 'lucide-react';
import { WidgetWrapper } from '@/components/dashboard/WidgetWrapper';
import { useStore } from '@/lib/store';
import { WidgetConfig } from '@/types';

interface WeatherWidgetProps {
  config: WidgetConfig;
}

export function WeatherWidget({ config }: WeatherWidgetProps) {
  const { weather, removeWidget, updateWidget } = useStore();

  return (
    <WidgetWrapper
      id={config.id}
      title={weather.location.split(',')[0]}
      icon={<Cloud className="w-4 h-4" />}
      size={config.size}
      onRemove={() => removeWidget(config.id)}
      onResize={(size) => updateWidget(config.id, { size })}
      noPadding
    >
      <div className="flex flex-col h-full p-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-4xl mb-1">{weather.icon}</div>
            <p className="text-3xl font-bold">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground">{weather.condition}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>H: {weather.high}°</p>
            <p>L: {weather.low}°</p>
            <p className="mt-2">Feels {weather.feelsLike}°</p>
          </div>
        </div>

        {/* Forecast */}
        <div className="grid grid-cols-4 gap-2 mt-auto pt-3 border-t">
          {weather.forecast.map((day) => (
            <div key={day.day} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
              <p className="text-lg mb-1">{day.icon}</p>
              <p className="text-xs font-medium">{day.high}°</p>
            </div>
          ))}
        </div>
      </div>
    </WidgetWrapper>
  );
}
