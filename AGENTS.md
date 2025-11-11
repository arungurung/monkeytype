# AGENT CODING GUIDELINES

This document provides essential information for autonomous coding agents operating in this repository.

## 1. Commands

| Action | Command | Notes |
| :--- | :--- | :--- |
| **Build** | `pnpm build` | Compiles the project for production. |
| **Lint** | `pnpm lint` | Checks code style and quality. |
| **Test All** | `pnpm test` | Runs all unit and integration tests. |
| **Test Single** | `pnpm test -- <path/to/file>` | Runs tests for a specific file (e.g., `jest path/to/file.test.ts`). |

## 2. Code Style & Conventions

- **Language:** TypeScript/JavaScript (ES2020+).
- **Formatting:** Adhere to Prettier rules (2-space indentation, single quotes).
- **Imports:** Absolute imports preferred. Group imports: 1) Node/External, 2) Internal/Components, 3) Relative.
- **Types:** Use explicit TypeScript types for all function arguments and return values.
- **Naming:** `camelCase` for variables/functions, `PascalCase` for components/classes.
- **Error Handling:** Use `try...catch` for asynchronous operations. Propagate errors clearly.
- **Comments:** Use JSDoc for public APIs. Comments should explain *why*, not *what*.

## 3. Documentation Search

- **Tool:** Use `context7` for searching project documentation and knowledge base.
- **Usage:** `context7 <search query>`
