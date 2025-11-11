# Monkeytype Clone

A modern typing speed test application inspired by Monkeytype, built with React, TanStack Router, and Tailwind CSS.

## Features

- ⏱️ **Multiple Test Modes**
  - Time-based tests (15s, 30s, 60s, 120s)
  - Word count tests (10, 25, 50, 100 words)
  - Quote typing tests (short, medium, long)
- 📊 **Comprehensive Statistics**
  - Real-time WPM (words per minute) tracking
  - Accuracy percentage with error counting
  - Detailed test history with charts
  - Performance trends visualization
- 💾 **Data Persistence**
  - Local storage for test history
  - Export history to JSON
  - Statistics across all test modes
- 🎨 **Modern UI/UX**
  - Clean, minimalist design
  - Responsive layout for all devices
  - Smooth animations and transitions
  - Real-time character highlighting
- ⚡ **Performance**
  - Fast and responsive with React 19
  - Optimized rendering with memoization
  - Prefetched quotes using TanStack Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Available Commands

| Command                       | Description                       |
| :---------------------------- | :-------------------------------- |
| `pnpm dev`                    | Start development server          |
| `pnpm build`                  | Build for production              |
| `pnpm serve`                  | Preview production build          |
| `pnpm test`                   | Run all tests                     |
| `pnpm test -- <path/to/file>` | Run specific test file            |
| `pnpm lint`                   | Check code style and quality      |
| `pnpm format`                 | Format code with Biome            |
| `pnpm check`                  | Run linting and formatting checks |

## Tech Stack

- **Framework:** React 19
- **Routing:** TanStack Router (manual route configuration)
- **State Management:** Zustand (for test history)
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm
- **Icons:** Lucide React
- **Charts:** Recharts

## Project Structure

```
monkeytype-clone/
├── src/
│   ├── components/       # React components
│   │   ├── typing-test/  # Typing test specific components
│   │   ├── AppLayout.tsx
│   │   ├── StatsChart.tsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── TypingTest.tsx
│   │   └── History.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useQuote.ts
│   │   └── usePrefetchQuotes.ts
│   ├── services/        # External API services
│   │   └── quotesApi.ts
│   ├── stores/          # Zustand stores
│   │   └── testHistoryStore.ts
│   ├── utils/           # Utility functions
│   │   └── wordGenerator.ts
│   ├── router.tsx       # Route configuration
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── AGENTS.md           # Agent coding guidelines
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with manual route configuration in `src/router.tsx`. The app has two main routes:

- `/` - Main typing test page
- `/history` - Test history and statistics page

### Adding a New Route

Edit `src/router.tsx` and add your route:

```tsx
import { createRoute } from '@tanstack/react-router';
import { YourComponent } from './pages/YourComponent';

const yourRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/your-path',
  component: YourComponent,
});

// Add to routeTree
const routeTree = rootRoute.addChildren([indexRoute, historyRoute, yourRoute]);
```

### Navigation

Use the `Link` component for SPA navigation:

```tsx
import { Link } from '@tanstack/react-router';

<Link to="/history">View History</Link>;
```

## Testing

This project uses [Vitest](https://vitest.dev/) with React Testing Library for unit and integration testing.

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test -- src/pages/TypingTest.test.tsx
```

### Test Coverage

Tests are included for:

- Quote API service (`src/services/quotesApi.test.ts`)
- Custom hooks (`src/hooks/useQuote.test.tsx`)
- Page components (`src/pages/TypingTest.test.tsx`)

## Code Style

This project follows strict TypeScript and modern React conventions:

- **Language:** TypeScript (ES2020+)
- **Formatting:** 2-space indentation, single quotes (enforced by Biome)
- **Naming Conventions:**
  - `camelCase` for variables and functions
  - `PascalCase` for components and classes
- **Type Safety:** Explicit TypeScript types for all function arguments and return values
- **Imports:** Absolute imports with `@/` alias supported

See `AGENTS.md` for detailed coding guidelines.

## How It Works

### Test Modes

1. **Time Mode**: Type as many words as possible within a set time limit (15s, 30s, 60s, 120s)
2. **Words Mode**: Type a specific number of words (10, 25, 50, 100)
3. **Quote Mode**: Type real quotes fetched from TheQuotesHub API

### State Management

- **Zustand** manages test history and persists data to localStorage
- **TanStack Query** handles quote fetching with caching and background refetching
- Local component state handles active test session data

### Quote API

Quotes are fetched from [TheQuotesHub.com](https://thequoteshub.com/) API. The app uses TanStack Query to:

- Cache quotes to reduce API calls
- Prefetch quotes for better UX
- Handle loading and error states

## Building for Production

```bash
pnpm build
```

The production build will be output to the `dist` directory. The build process:

1. Bundles the application with Vite
2. Type-checks with TypeScript
3. Optimizes assets and code splitting

### Preview Production Build

```bash
pnpm serve
```

## Contributing

1. Follow the code style guidelines in `AGENTS.md`
2. Write tests for new features
3. Run `pnpm check` before committing
4. Ensure all tests pass with `pnpm test`

## Acknowledgments

- Inspired by [Monkeytype](https://monkeytype.com/)
- Built with [TanStack](https://tanstack.com/) ecosystem
- Quotes provided by [TheQuotesHub.com](https://thequoteshub.com/)
