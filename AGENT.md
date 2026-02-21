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
This project follows a standard Next.js App Router structure with dedicated directories for components and API integration services.

### Project Directory Layout
```text
.agent/             # AI Agent rules & workflows
app/                # Next.js App Router pages and layouts
├── dashboard/      # Main dashboard interface
├── overlays/       # Streaming overlay pages (e.g., clip-shoutout)
├── workflows/      # Node-based workflow editor pages
├── globals.css     # Global Tailwind styles
├── layout.tsx      # Root layout
└── page.tsx        # Homepage
components/         # Reusable React components (shadcn ui + custom)
constants/          # Static configuration and constants
lib/                # Utility functions and shared libraries (e.g., api-client)
public/             # Static assets
services/           # Frontend API wrappers communicating with blaze-backend
```

- **App Router (`app/`)**: Follows Next.js conventions. Contains route segments, pages, layout files, and specialized routes like dashboard workflows and stream overlays.
- **Components (`components/`)**: Houses UI building blocks. Priority should be given to existing `shadcn` components.
- **Services (`services/`)**: Centralized HTTP client logic (Axios wrappers) to interact with the external backend API.

## 📜 Coding Conventions & Rules

### 1. UI & Styling (Strict Requirements)
- **Component Preference**: **Always try to use UI components from `shadcn` first** before building custom ones or importing third-party libraries.
- **Font Sizes**: Consider the smallest acceptable font-size to be `text-sm`. **Do not use `text-xs`**.
- **Input Colors**: **Do not use the primary CI color (`#FF8C00`) in any input component**. Use other suitable colors (e.g., default border/ring colors) instead.

### 2. State & Data Fetching
- Use centralized services in `/services` for all backend data interactions to maintain a consistent API contract.
- Leverage the configured `api-client.ts` in `/lib` for standard request configuration (e.g., interceptors, base URLs).

### 3. Code Quality & Formatting
- Ensure strict TypeScript typing.
- Follow the configured ESLint (`eslint.config.mjs`) and Tailwind v4 (`@tailwindcss/postcss`) standards.
- Keep server and client components distinctly separated with `"use client"` directives only where interactivity or browser APIs are required.

## 🛠️ Workflows
There are specific `.md` workflows located in the `.agent/workflows` directory for executing regular developer tasks (e.g., `/create-new-widget-frontend`). Consult these workflows if asked to implement a feature they cover to ensure consistency with the established patterns.

---
**Agent Directive:** When addressing tasks in `blaze-frontend`, ALWAYS review this `AGENT.md` and related `.agent/rules/**/*` first. Ensure your code strictly adheres to these rules, specifically the *UI & Styling* requirements (shadcn priority, font constraints, input color).
