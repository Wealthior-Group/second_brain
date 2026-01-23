# SecondBrain - Personal AI Command Center

A beautiful, AI-powered productivity dashboard built with Next.js 14. Manage tasks, notes, habits, and more in one unified interface.

![SecondBrain](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

## Features

### Dashboard Widgets
- **Welcome Widget** - Personalized greeting with AI-generated daily insights
- **AI Assistant** - Chat with AI for productivity tips and task help
- **Tasks Widget** - Quick task overview with priority filtering
- **Calendar Widget** - Today's events at a glance
- **Notes Widget** - Recent notes with quick access
- **Habits Widget** - Daily habit tracker with streaks
- **Focus Timer** - Pomodoro timer for deep work sessions
- **Quick Capture** - Instantly capture thoughts and ideas
- **Weather Widget** - Current conditions and forecast
- **Mood Tracker** - Log and visualize your daily mood
- **Goals Widget** - Track progress on your objectives
- **Stats Widget** - Productivity analytics and charts
- **Bookmarks Widget** - Quick links to your favorite sites
- **News Widget** - Stay updated with latest headlines

### Full Pages
- **Tasks** - Complete task management with filters, priorities, and due dates
- **Notes** - Markdown editor with tagging and search
- **Calendar** - Monthly view with event management
- **Settings** - Customize appearance, timer, AI, and manage data

### Core Features
- Drag-and-drop widget reordering
- Dark/Light theme support
- Command palette (Cmd/Ctrl + K)
- Collapsible sidebar navigation
- AI chat sidebar
- Local storage persistence
- Responsive design with mobile navigation
- Export/Import data functionality

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand with persist middleware
- **Drag & Drop**: @dnd-kit
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: OpenAI API (with intelligent mock fallback)
- **Markdown**: react-markdown + remark-gfm

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secondbrain.git
cd secondbrain
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up AI features:
Create a `.env.local` file with your OpenAI API key:
```env
OPENAI_API_KEY=your_api_key_here
```
> Note: The app works without an API key using intelligent mock responses.

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
secondbrain/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── tasks/             # Tasks page
│   ├── notes/             # Notes page
│   ├── calendar/          # Calendar page
│   └── settings/          # Settings page
├── components/
│   ├── dashboard/         # Dashboard components
│   │   ├── DashboardGrid.tsx
│   │   ├── WidgetWrapper.tsx
│   │   └── AddWidgetModal.tsx
│   ├── layout/            # Layout components
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── CommandPalette.tsx
│   ├── shared/            # Shared components
│   │   └── AIChatSidebar.tsx
│   ├── ui/                # shadcn/ui components
│   └── widgets/           # All 14 widget components
├── lib/
│   ├── store.ts           # Zustand state management
│   ├── ai.ts              # AI integration
│   ├── constants.ts       # App constants
│   ├── mock-data.ts       # Demo data
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript definitions
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/secondbrain)

1. Push your code to GitHub
2. Import the project on Vercel
3. Add `OPENAI_API_KEY` environment variable (optional)
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
```

The output will be in the `.next` folder, ready for deployment to any Node.js hosting platform.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Built by [Roberto Mazzotta](https://mazzotta.dev)

---

**SecondBrain** - Your digital brain for peak productivity.
