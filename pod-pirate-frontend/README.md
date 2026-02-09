# 🏴‍☠️ Pod Pirate - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)

> Modern Next.js web application for discovering, streaming, and managing podcasts.

*Part of the [Pod Pirate](../README.md) full-stack podcast platform. See [Backend API](../pod-pirate-backend/README.md) for the server application.*

## ✨ Features

### User Interface & Experience
- 🎧 **Advanced Audio Player** - Beautiful, responsive player with mini-player mode
- 🎨 **Drawer-Based Interface** - Seamless navigation with drawer components
- 🌙 **Dark Mode** - System-aware theme with manual toggle
- 📱 **Progressive Web App** - Install and use offline
- ⚡ **Optimized Performance** - Fast page loads with Next.js App Router

### Authentication & Authorization
- 🔐 **Secure Authentication** - NextAuth.js with JWT tokens
- 👤 **User Profiles** - Profile management with image uploads
- 🔒 **Role-Based Access** - Support for User, Creator, and Admin roles
- 🛡️ **Protected Routes** - Automatic authentication middleware

### Content Management
- 🎙️ **Podcast Publishing** - Create and manage podcast shows
- 📝 **Episode Management** - Upload and organize episodes
- 🖼️ **Media Uploads** - Support for cover images and audio files
- 🔍 **Browse & Discovery** - Search and filter podcasts

### Dashboard Features
- 📊 **User Dashboard** - Manage subscriptions and listening history
- 🎯 **Creator Tools** - Track your content and manage episodes
- 👥 **Admin Panel** - User management and content moderation

## 🛠️ Tech Stack

**Core Framework**
- Next.js 16.1.6 with App Router
- React 19.2.3
- TypeScript 5

**Styling & UI**
- Tailwind CSS 4
- shadcn/ui + Radix UI components
- Motion for animations
- Lucide React icons

**State & Forms**
- React Hook Form
- Zod validation
- NextAuth.js authentication

**Developer Experience**
- ESLint for code quality
- Prettier for code formatting
- TypeScript strict mode

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- [Backend API](../pod-pirate-backend/README.md) running on `localhost:8080`

### Installation

1. **Install dependencies**
   ```bash
   cd pod-pirate-frontend
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Backend API URL
   NEXT_BACKEND_URL=http://localhost:8080

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   AUTH_SECRET=your-secret-key-here

   # Image CDN Hostname
   NEXT_IMAGES_REMOTE_PATTERN=your-azure-hostname.blob.core.windows.net

   # Frontend Site URL (for SEO)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser at** [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Build and start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
pod-pirate-frontend/
├── actions/              # Server actions
│   ├── admin/           # Admin-specific actions
│   ├── auth/            # Authentication actions
│   ├── me/              # User profile actions
│   └── user/            # User-related actions
├── app/                 # Next.js App Router
│   ├── (public)/        # Public pages
│   ├── admin/           # Admin dashboard
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # User dashboard
│   └── api/             # API routes
├── components/          # React components
│   ├── action/          # Action menus
│   ├── audio/           # Audio player components
│   ├── card/            # Card components
│   ├── filter/          # Filter components
│   ├── form/            # Form components
│   ├── grid/            # Grid layouts
│   ├── header/          # Header components
│   ├── list/            # List components
│   ├── menu/            # Navigation menus
│   ├── provider/        # Context providers
│   ├── skeleton/        # Loading skeletons
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── api/            # API client functions
│   └── auth.ts         # Authentication utilities
├── public/              # Static assets
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🔧 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_BACKEND_URL` | Backend API base URL | `http://localhost:8080` | Yes |
| `NEXTAUTH_URL` | Frontend application URL | `http://localhost:3000` | Yes |
| `AUTH_SECRET` | Secret for NextAuth.js | Generate with `openssl rand -base64 32` | Yes |
| `NEXT_IMAGES_REMOTE_PATTERN` | Azure Blob Storage hostname | `storage.blob.core.windows.net` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO | `http://localhost:3000` | Yes |

## 🧪 Testing

```bash
# Run linting
npm run lint

# Check code formatting
npm run format:check

# Format code
npm run format
```

## 🔗 Related

- [Main README](../README.md) - Full project documentation
- [Backend API](../pod-pirate-backend/README.md) - Spring Boot REST API
