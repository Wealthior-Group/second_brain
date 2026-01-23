'use client';

import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';

export default function Home() {
  return (
    <AppShell>
      <DashboardGrid />
    </AppShell>
  );
}
