import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://secondbrain.mazzotta.dev'),
  title: 'SecondBrain | Personal AI Command Center',
  description:
    'Your personal AI-powered productivity dashboard. Manage tasks, notes, habits, and more in one beautiful interface. Built by Roberto Mazzotta.',
  keywords:
    'productivity dashboard, AI assistant, task manager, habit tracker, personal OS, Second Brain, notion alternative',
  authors: [{ name: 'Roberto Mazzotta', url: 'https://mazzotta.dev' }],
  openGraph: {
    title: 'SecondBrain - Personal AI Command Center',
    description:
      'Your digital brain for peak productivity. AI-powered task management, notes, habits, and focus tracking.',
    url: 'https://secondbrain.mazzotta.dev',
    type: 'website',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecondBrain - Personal AI Command Center',
    description: 'Your digital brain for peak productivity',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
