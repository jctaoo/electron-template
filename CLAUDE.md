# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn dev` - Start development server with hot reload using elecrun and Vite
- `yarn preview` - Build and run the production version locally

### Building & Packaging  
- `yarn build` - Build the application (both main and renderer processes)
- `yarn clean` - Clean build artifacts using elecrun
- `yarn pack` - Build and package for Windows and Linux
- `yarn pack:all` - Package for all platforms (Windows, Linux, macOS)
- `yarn pack:win` - Package for Windows only
- `yarn pack:mac` - Package for macOS only
- `yarn pack:linux` - Package for Linux only
- `yarn rebuild` - Rebuild native dependencies for Electron

### Code Quality
- `yarn fix` - Run all fix commands
- `yarn fix:prettier` - Format code with Prettier

## Architecture

This is an Electron application with Vue 3 frontend, using elecrun as the build toolchain and electron-builder for packaging.

### Project Structure
- `src/main/` - Main Electron process (Node.js)
- `src/renderer/` - Renderer process (Vue 3 web app) 
- `src/common/` - Shared code between main and renderer
- `preload.ts` - Preload script for secure IPC communication

### Key Components

#### Main Process (`src/main/index.ts`)
- Window management and creation logic
- IPC handlers for authentication and theme switching
- Uses session management for user login state
- Supports both development (localhost:5173) and production (file://) URLs

#### Window Configuration (`src/main/windowConfig.ts`)
- Defines window configurations for different page types
- Auth pages: 800x600, non-resizable
- Home page: 1500x900, with title bar overlay

#### Renderer Process
- Vue 3 with Vue Router using hash-based routing
- Uses Naive UI component library
- TailwindCSS for styling
- Pages: Home, Login, Register, Forget Password, WeChat Login

#### Services
- `windowStateManager` - Persists and restores window positions/sizes
- `userSession` - Handles login token storage using electron-store
- `notificationService` - System notifications
- `themeService` - Light/dark theme management

#### Authentication Flow
- Login token stored via IPC to main process
- Session determines initial window (login vs home page)  
- Auth pages have shared styling and behavior

#### Build Configuration
- Uses elecrun with `--esm --preload preload.ts` flags
- Vite for renderer bundling with Vue SFC support
- TypeScript throughout with separate tsconfig for main/renderer
- Path aliases: `@common` for shared code, `@renderer` for renderer code

### Development Notes
- Development server runs on port 5173
- DevTools integration with persistent window state
- Cross-platform packaging with electron-builder
- Native dependency rebuilding required after installs