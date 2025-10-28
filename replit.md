# Block Article Editor

## Overview

A powerful, minimalist block-based article editor built with React, TypeScript, and Express. The application enables users to create rich, responsive articles using a visual block system with advanced styling capabilities. It features a three-column layout (block palette, canvas, style editor), drag-and-drop block reordering, responsive breakpoint controls, and real-time visual editing. The editor follows a hybrid design approach inspired by Linear's minimalist aesthetics, VS Code's editor interface patterns, and Notion's block-based interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with a consistent design system.

**State Management**: 
- React Context API (`EditorContext`) for global editor state management
- TanStack Query (React Query) for server state and API data synchronization
- Local state for component-specific UI interactions

**Styling System**:
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theme management (light/dark modes)
- Custom breakpoint system (mobile/tablet/desktop) integrated into block styles
- Google Fonts integration for typography options

**Block System**:
- Type-safe block definitions using Zod schemas
- Block categories: text, media, code, layout
- Responsive styles stored per-breakpoint (mobile, tablet, desktop)
- Drag-and-drop functionality via @dnd-kit library
- Block types include headings, paragraphs, images, videos, code blocks, flexbox containers, and sections

**Key Features**:
- Real-time WYSIWYG editing with live style updates
- Undo/redo functionality with history tracking
- JSON export/import for article portability
- Syntax highlighting for code blocks (highlight.js)
- Responsive preview modes
- Visual style editor with granular control over typography, spacing, layout, and colors

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API with the following endpoints:
- `GET /api/articles` - Retrieve all articles
- `GET /api/articles/:id` - Retrieve single article
- `POST /api/articles` - Create new article
- `PATCH /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

**Data Validation**: Zod schemas for runtime type validation and schema definition, shared between frontend and backend for type safety.

**Storage Layer**: 
- Abstracted storage interface (`IStorage`) allowing multiple implementations
- In-memory storage (`MemStorage`) for development
- Configured for PostgreSQL via Drizzle ORM (production-ready but not yet connected)

**Development Setup**:
- Vite middleware integration for HMR in development
- Custom logging middleware for API request tracking
- Static file serving for production builds

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL with the following setup:
- Schema definitions in TypeScript (`shared/schema.ts`)
- Migration support via drizzle-kit
- Neon serverless PostgreSQL driver ready for deployment

**Database Schema**:
- Articles table with JSON storage for block content
- User authentication table (defined but not implemented)
- Timestamps for created/updated tracking
- JSON columns for flexible block structure and breakpoint-specific styles

**Current Implementation**: In-memory storage using Maps for rapid development and testing. Database integration is configured but not actively used.

### External Dependencies

**Third-Party Services**:
- Google Fonts CDN for typography options (Inter, Roboto, Montserrat, JetBrains Mono, etc.)
- Neon Database (PostgreSQL) - configured but not actively connected

**Key NPM Packages**:
- `@radix-ui/*` - Accessible UI primitives for dialogs, dropdowns, popovers, etc.
- `@tanstack/react-query` - Server state management and caching
- `@dnd-kit/core` and `@dnd-kit/sortable` - Drag-and-drop functionality
- `drizzle-orm` and `@neondatabase/serverless` - Database ORM and driver
- `highlight.js` - Syntax highlighting for code blocks
- `react-hook-form` and `@hookform/resolvers` - Form validation
- `zod` - Schema validation shared across client/server
- `wouter` - Lightweight routing
- `tailwindcss` - Utility-first CSS framework
- `vite` - Frontend build tool and dev server

**Design Assets**:
- Custom favicon
- Pre-configured font lists with weights and categories
- Default style presets for different block types

**Development Tools**:
- Replit-specific plugins for runtime error handling and development banners
- TypeScript for type safety across the stack
- ESBuild for server bundling in production