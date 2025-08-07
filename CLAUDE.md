# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a monorepo for an expense tracker application using pnpm workspaces and Turbo (though Turbo config is minimal). The project has two main applications and three shared packages:

**Applications:**
- `apps/web/` - Next.js 15 web application (React 19) 
- `apps/mobile/` - Expo/React Native mobile application

**Shared Packages:**
- `packages/ui/` - Shared UI components (`@ui`) with Supabase integration
- `packages/api/` - API utilities (`@api`) using Axios
- `packages/utils/` - Utility functions (`@utils`)

## Development Commands

**Setup:**
```bash
pnpm install
```

**Web App (apps/web/):**
```bash
cd apps/web
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

**Mobile App (apps/mobile/):**
```bash
cd apps/mobile
pnpm start        # Start Expo development server
pnpm ios          # Start iOS simulator
pnpm android      # Start Android emulator
pnpm web          # Start web version via Expo
```

**Root Level:**
```bash
pnpm build        # Build TypeScript (tsc) at root level
```

## Key Technologies

- **Frontend**: Next.js 15 (App Router), React 19, React Native via Expo
- **Backend Integration**: Supabase (in @ui package)
- **HTTP Client**: Axios (in @api package)
- **Package Management**: pnpm workspaces
- **Build Tool**: Turbo (minimal config)
- **Language**: TypeScript throughout

## Package Dependencies

The web app imports shared packages as `@ui`, `@api`, and `@utils`. The mobile app can access these same packages. All packages use TypeScript with their main entry points in `src/categories.ts`.
