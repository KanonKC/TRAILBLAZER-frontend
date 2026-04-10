# Blaze Frontend - Agent Instructions

Welcome to the `blaze-frontend` project! This file serves as the core instruction manual for any AI agent interacting with this repository. Please follow these guidelines, coding standards, and project-specific rules for all interactions, feature implementations, and refactoring tasks.

## 🚀 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (`react`, `react-dom` v19)
- **Styling**: Tailwind CSS v4
- **UI Components**: `shadcn/ui`, `radix-ui`, `lucide-react`, `sonner`
- **Other Key Libraries**: 
  - `@xyflow/react` for node-based workflows
  - `three` for 3D elements
  - `axios` for API fetching
  - `@aws-sdk/client-s3` for AWS operations

## 🏗️ Architecture & Structure
This project follows a **Feature-Based Modular Architecture**. All business logic and domain-specific code is grouped into the `features/` directory to ensure high maintainability and stable authentication.

### Project Directory Layout
```text
.agent/             # AI Agent rules & workflows
app/                # Next.js App Router (Routing only)
├── dashboard/      # Main dashboard route segments
└── overlays/       # Streaming overlay route segments
features/           # Modular Domain Logic 🟢
└── [feature-name]/
    ├── components/ # Local UI pieces
    ├── hooks/      # THE CONTROLLER (Business Logic & State)
    ├── api/        # THE REPOSITORY (Pure API calls)
    └── types.ts    # Domain-specific Typescript interfaces
components/         # Shared UI Design System (Shadcn + Custom)
constants/          # Static configuration and constants
lib/                # Core infrastructure (api-client.ts)
services/           # Shared/Legacy API wrappers
```

- **Features (`features/`)**: This is the heart of the application logic. Each feature (like `first-word`) is self-contained. 
- **Controller-View Pattern**: Logic must live in a custom hook (`/hooks/`), leaving the component (`/components/`) purely focused on rendering UI.
- **Proxy Layer (`/lib/api-client`)**: All client-side requests use **Relative URLs** (e.g., `/api/v1/user`). The Next.js server proxies these to the backend via `next.config.ts` rewrites to ensure cookie stability and bypass CORS.

## 📜 Coding Conventions & Rules

### 1. UI & Styling (Strict Requirements)
- **Component Preference**: **Always try to use UI components from `shadcn` first** before building custom ones.
- **Font Sizes**: Smallest acceptable font-size is `text-sm`. **Do not use `text-xs`**.
- **Input Colors**: **Do not use the primary CI color (`#FF8C00`) in any input component**. Use other suitable colors instead.

### 2. State & Business Logic
- **"Hook as Controller"**: **NEVER put complex state or API logic directly in the View component.** Always extract it into a custom hook within the feature's `hooks/` directory.
- **Data Fetching**: Use a hybrid approach. Fetch initial data via SSR in `page.tsx` and pass it to the component. Use the feature hook for interactivity and updates on the client.

### 3. API Communication
- Use the central `apiClient` in `lib/api-client.ts`.
- **Absolute URLs are forbidden** for client-side API calls. Use relative paths that target the proxy.

### 3. Code Quality & Formatting
- Ensure strict TypeScript typing.
- Follow the configured ESLint (`eslint.config.mjs`) and Tailwind v4 (`@tailwindcss/postcss`) standards.
- Keep server and client components distinctly separated with `"use client"` directives only where interactivity or browser APIs are required.

## 🛠️ Workflows
There are specific `.md` workflows located in the `.agent/workflows` directory for executing regular developer tasks (e.g., `/create-new-widget-frontend`). Consult these workflows if asked to implement a feature they cover to ensure consistency with the established patterns.

---
**Agent Directive:** When addressing tasks in `blaze-frontend`, ALWAYS review this `AGENT.md` and related `.agent/rules/**/*` first. Ensure your code strictly adheres to these rules, specifically the *UI & Styling* requirements (shadcn priority, font constraints, input color).
