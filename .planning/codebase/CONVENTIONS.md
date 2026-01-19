# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- PascalCase for React components (`App.tsx`)
- camelCase for utility/entry files (`main.tsx`, `index.js`, `production.js`)
- kebab-case for config files (`vite.config.ts`, `eslint.config.js`)
- No test file naming convention (no tests exist)

**Functions:**
- camelCase for all functions (`playChannel`, `handlePlayPause`)
- `handle{Action}` prefix for event handlers (`handleKeyDown`, `handleMouseMove`)
- `use{Name}` for React hooks (following React convention)

**Variables:**
- camelCase for all variables (`channels`, `selectedIndex`, `currentTrack`)
- `{noun}Ref` suffix for React refs (`audioRef`, `carouselRef`, `playTimeoutRef`)
- No UPPER_SNAKE_CASE constants observed

**Types:**
- PascalCase for interfaces (`Channel`)
- No I-prefix convention
- Inline types in function signatures preferred

## Code Style

**Formatting:**
- No Prettier configuration detected
- 2-space indentation (inferred from source)
- Single quotes for strings
- No semicolons (TypeScript/JSX)
- Template literals for string interpolation

**Linting:**
- ESLint with flat config (`eslint.config.js`)
- Extends: `@eslint/js` recommended, `typescript-eslint` recommended
- React hooks plugin (`eslint-plugin-react-hooks`)
- React Refresh plugin for Vite HMR
- Run: `npm run lint`

## Import Organization

**Order:**
1. React imports (`import { useState, useEffect } from 'react'`)
2. Local imports (`import './App.css'`)

**Grouping:**
- No blank lines between import groups
- No alphabetical sorting
- CSS imports at end

**Path Aliases:**
- None configured
- Relative imports only (`./App.css`, `./App.tsx`)

## Error Handling

**Patterns:**
- Promise `.catch()` for async operations
- `console.error()` for logging errors
- Silent failures (no user-facing error messages)
- Graceful degradation (e.g., empty track info shown)

**Error Types:**
- No custom error classes
- No try/catch blocks in frontend
- Backend uses basic error response: `res.status(500).send('Stream error')`

## Logging

**Framework:**
- `console.log` for debug output
- `console.error` for errors
- No structured logging library

**Patterns:**
- Log URLs being accessed: `console.log('Proxying stream:', streamUrl)`
- Log playback status: `console.log('Playback started')`
- No log levels or filtering

## Comments

**When to Comment:**
- Section headers for major UI areas (`{/* Audio element */}`, `{/* Hero Channel Art */}`)
- Brief inline comments for non-obvious logic

**JSDoc/TSDoc:**
- Not used
- TypeScript interfaces serve as documentation

**TODO Comments:**
- None detected

## Function Design

**Size:**
- Main component is ~400 lines (could be decomposed)
- Handler functions are small (5-20 lines)
- `useCallback` for memoized handlers

**Parameters:**
- Single parameter for index-based operations (`playChannel(index)`)
- Event objects for handlers (`handleKeyDown(e: KeyboardEvent)`)

**Return Values:**
- Early returns for guard clauses (`if (!channels[index]) return`)
- Explicit JSX returns in component

## Module Design

**Exports:**
- Default export for main component (`export default App`)
- No named exports
- No barrel files (single-file architecture)

**State Organization:**
- All state in single component via useState
- localStorage for persistence
- useRef for DOM references and mutable values

**Hooks Usage:**
- useCallback for handlers (dependency arrays specified)
- useEffect for side effects (fetch, keyboard listeners, polling)
- useRef for audio element, carousel, drag state

---

*Convention analysis: 2026-01-19*
*Update when patterns change*
