'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  User,
  Palette,
  Bell,
  Timer,
  Database,
  Info,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Key,
  ExternalLink,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useStore } from '@/lib/store';
import { setApiKey, getApiKey } from '@/lib/ai';
import { APP_VERSION, APP_AUTHOR } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, setTheme: setNextTheme } = useTheme();
  const {
    user,
    setUser,
    timerSettings,
    setTimerSettings,
    exportData,
    importData,
    resetAllData,
  } = useStore();

  const [apiKey, setApiKeyState] = useState(getApiKey() || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    setApiKey(apiKey);
    toast.success('API key saved successfully');
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secondbrain-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = importData(json);
      if (success) {
        toast.success('Data imported successfully');
      } else {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    resetAllData();
    toast.success('All data has been reset');
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={user.timezone}
                  onValueChange={(v) => setUser({ timezone: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Zurich">Europe/Zurich</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">America/New York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how SecondBrain looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNextTheme('light')}
                    className="flex-1"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNextTheme('dark')}
                    className="flex-1"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNextTheme('system')}
                    className="flex-1"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Focus Timer
              </CardTitle>
              <CardDescription>
                Configure your Pomodoro timer settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Focus Duration</Label>
                    <span className="text-sm text-muted-foreground">
                      {timerSettings.focusDuration} min
                    </span>
                  </div>
                  <Slider
                    value={[timerSettings.focusDuration]}
                    onValueChange={([v]) => setTimerSettings({ focusDuration: v })}
                    min={5}
                    max={60}
                    step={5}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Short Break</Label>
                    <span className="text-sm text-muted-foreground">
                      {timerSettings.shortBreakDuration} min
                    </span>
                  </div>
                  <Slider
                    value={[timerSettings.shortBreakDuration]}
                    onValueChange={([v]) => setTimerSettings({ shortBreakDuration: v })}
                    min={1}
                    max={15}
                    step={1}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Long Break</Label>
                    <span className="text-sm text-muted-foreground">
                      {timerSettings.longBreakDuration} min
                    </span>
                  </div>
                  <Slider
                    value={[timerSettings.longBreakDuration]}
                    onValueChange={([v]) => setTimerSettings({ longBreakDuration: v })}
                    min={5}
                    max={30}
                    step={5}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Sessions until Long Break</Label>
                    <span className="text-sm text-muted-foreground">
                      {timerSettings.sessionsUntilLongBreak}
                    </span>
                  </div>
                  <Slider
                    value={[timerSettings.sessionsUntilLongBreak]}
                    onValueChange={([v]) => setTimerSettings({ sessionsUntilLongBreak: v })}
                    min={2}
                    max={6}
                    step={1}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Breaks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start break timer
                    </p>
                  </div>
                  <Switch
                    checked={timerSettings.autoStartBreaks}
                    onCheckedChange={(v) => setTimerSettings({ autoStartBreaks: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-start Focus</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start focus after break
                    </p>
                  </div>
                  <Switch
                    checked={timerSettings.autoStartFocus}
                    onCheckedChange={(v) => setTimerSettings({ autoStartFocus: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when timer completes
                    </p>
                  </div>
                  <Switch
                    checked={timerSettings.soundEnabled}
                    onCheckedChange={(v) => setTimerSettings({ soundEnabled: v })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                AI Settings
              </CardTitle>
              <CardDescription>
                Configure AI assistant (optional - works without API key)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKeyState(e.target.value)}
                    placeholder="sk-..."
                  />
                  <Button variant="outline" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? 'Hide' : 'Show'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                  The AI assistant works without a key using intelligent mock responses.
                </p>
              </div>
              <Button onClick={handleSaveApiKey} variant="outline">
                Save API Key
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, import, or reset your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your data including tasks, notes,
                        habits, and settings. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleResetData}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Reset Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">{APP_VERSION}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Built by</span>
                <span className="font-medium">{APP_AUTHOR}</span>
              </div>
              <Separator />
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground mb-4">
                  SecondBrain is your personal AI-powered productivity command center.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-500 hover:underline flex items-center gap-1"
                  >
                    GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://mazzotta.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-500 hover:underline flex items-center gap-1"
                  >
                    Portfolio
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
