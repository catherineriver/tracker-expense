# 💰 Expense Tracker

A cross-platform expense tracking application built with React, React Native, and TypeScript. Track your expenses across web and mobile devices with real-time synchronization.

## 🚀 Features

- **Cross-Platform**: Web (Next.js) and Mobile (React Native/Expo) applications
- **Real-time Sync**: Supabase integration for real-time data synchronization
- **User Authentication**: Secure login and registration system
- **Expense Management**: Add, edit, delete, and categorize expenses
- **Advanced Filtering**: Filter expenses by category, date range, and amount
- **Visual Dashboard**: Interactive charts and spending analytics
- **Share Reports**: Generate shareable expense reports
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📁 Project Structure

This is a monorepo built with pnpm workspaces and includes:

```
tracker-expense/
├── apps/
│   ├── web/           # Next.js web application
│   └── mobile/        # React Native/Expo mobile app
├── packages/
│   ├── api/           # Shared API layer (Supabase & local storage)
│   ├── constants/     # Shared constants (categories, etc.)
│   ├── utils/         # Shared utilities and types
└── docs/              # Documentation
```

## 🛠 Tech Stack

- **Frontend**: React 19, Next.js 15, React Native 0.79, Expo 53
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Package Manager**: pnpm
- **Build Tool**: Turbo (monorepo management)

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Expo CLI (for mobile development)
- Supabase account (for real-time features)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd tracker-expense
pnpm install
```

### 2. Set Up Environment Variables

Create `.env.local` files in both apps:

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# apps/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Servers

**Web Application:**
```bash
cd apps/web
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000)

**Mobile Application:**
```bash
cd apps/mobile
pnpm start
```
Scan QR code with Expo Go app or run on simulator

## 📚 Available Commands

### Root Level Commands
```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
```

### Web Application (`apps/web/`)
```bash
pnpm dev              # Start development server (http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Mobile Application (`apps/mobile/`)
```bash
pnpm start            # Start Expo development server
pnpm android          # Start on Android device/emulator
pnpm ios              # Start on iOS simulator
pnpm web              # Start web version of mobile app
```

### Package Development
```bash
# Build individual packages
cd packages/api && pnpm build
cd packages/utils && pnpm build
cd packages/constants && pnpm build
```

## 🏗 Architecture

### Data Flow
- **Real-time sync**: Changes sync across devices via Supabase
- **Cloud-first**: Data is stored in Supabase with real-time updates

### Package Structure
- `@api`: Handles data persistence with Supabase
- `@utils`: Types, validation, calculations, date formatting
- `@constants`: Expense categories and other constants

### Component Organization
- **Features**: Business logic components (`auth`, `expenses`, `dashboard`)
- **UI**: Reusable UI components (`Button`, `Card`, `Loading`)
- **Layout**: Layout components (`Navigation`, `PageLayout`)
- **Forms**: Form-specific components and validation

## 🔧 Development

### Adding a New Feature

1. **API Layer**: Add methods to appropriate API class (`packages/api/src/`)
2. **Types**: Define types in `packages/utils/src/types.ts`
3. **Components**: Create feature components in `apps/{web|mobile}/src/components/features/`
4. **Styling**: Add CSS modules for web components
5. **Integration**: Wire up in main pages/screens

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and Next.js
- **CSS Modules**: Scoped styling for components
- **File Naming**: PascalCase for components, kebab-case for files

## 📱 Mobile Development

The mobile app uses:
- **Expo SDK 53**: For native functionality
- **React Native 0.79**: Latest stable version
- **AsyncStorage**: For local data persistence
- **Expo Clipboard**: For sharing functionality
- **Safe Area Context**: For proper device handling

### Testing on Devices

1. Install [Expo Go](https://expo.dev/client) on your device
2. Run `pnpm start` in `apps/mobile/`
3. Scan QR code to open app

## 🔐 Authentication

- **Supabase Auth**: Email/password authentication
- **Session Management**: Automatic token handling
- **Protected Routes**: AuthGuard components

## 🚀 Deployment

### Web Application
```bash
cd apps/web
pnpm build
pnpm start  # or deploy to Vercel/Netlify
```

### Mobile Application
```bash
cd apps/mobile
eas build    # Build for app stores (requires Expo Application Services)
```

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues (mobile):**
```bash
cd apps/mobile
npx expo start --clear
```

**TypeScript errors:**
```bash
pnpm build  # Build all packages first
```

**Dependencies not found:**
```bash
rm -rf node_modules
pnpm install
```

### Environment Setup

Make sure you have the correct Node.js version and pnpm installed:
```bash
node --version  # Should be 18+
pnpm --version  # Should be 8+
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend services
- [Expo](https://expo.dev) for mobile development tools
- [Next.js](https://nextjs.org) for web framework
- [React Native](https://reactnative.dev) for mobile framework

---

**Happy expense tracking! 💰**
