# 🏛️ Blaze Frontend: Architecture Overview

This document serves as the official architectural guide for the `blaze-frontend` project. It follows modern Next.js 14+ best practices and a **Feature-Based Modular Design**.

---

## 🏗️ 1. Core Philosophy: Separation of Concerns

The architecture is built on three distinct layers to ensure UI simplicity and logic reusability.

| Layer | Component Type | Responsibility |
| :--- | :--- | :--- |
| **View** | `features/[name]/components/` | **Thin UI.** Receives data and functions from a Hook. Almost no `useEffect` or state logic. |
| **Controller** | `features/[name]/hooks/` | **The Brain.** Encapsulates all business logic, local state, validation, and API orchestration. |
| **Repository** | `features/[name]/api/` | **Pure Data.** Stateless Axios/Fetch functions that communicate with the backend. |

---

## 📂 2. Directory Structure

We use a **Feature-First** layout to group related logic together.

```text
/ (Project Root)
├── app/                      # Route segments (Next.js 14 App Router)
├── features/                 # Modular domains (e.g., first-word, drop-image)
│   └── [feature-name]/
│       ├── api/             # Pure API calls (Axios)
│       ├── hooks/           # Controller hooks (Logic)
│       ├── components/       # Feature-specific UI
│       └── types.ts         # TypeScript definitions
├── components/               # Global / Shared UI (Shadcn components)
├── services/                 # Legacy/Shared service wrappers
├── lib/                      # Core infrastructure (api-client.ts)
└── utils/                    # Global utility functions (Formatting, Toasts)
```

---

## 🧠 3. Pattern: "Hook as Controller"

Instead of putting complex logic into [page.tsx](file:///d:/Documents/Blaze/blaze-frontend/app/dashboard/widgets/first-word/page.tsx) or `Component.tsx`, all logic is moved to a custom hook (e.g., [useFirstWord.ts](file:///d:/Documents/Blaze/blaze-frontend/features/first-word/hooks/useFirstWord.ts)).

### **Standard Logic Flow:**
1.  **Page (Server)**: Fetches initial data (`initialConfig`) via SSR.
2.  **Controller (Hook)**: Receives the data and manages loading/saving/testing states.
3.  **View (Component)**: Calls `const controller = useFirstWord(initialConfig)`. It then simply maps `controller.replyMessage` to an input field.

---

## 🛡️ 4. API & Authentication Strategy

### **Next.js Transparent Proxy**
We no longer call `http://localhost:8080` directly from the browser. Instead, we use a **Proxy Layer** to solve CORS and cookie instability.

1.  **Proxy Rewrite ([next.config.ts](file:///d:/Documents/Blaze/blaze-frontend/next.config.ts))**:
    *   Requests to `/api/*` are transparently forwarded to the backend.
    *   This makes the application appear as **"Same-Origin"** to the browser.
2.  **Stable Cookies**:
    *   Since it's Same-Origin, `accessToken` and `refreshToken` cookies are **never blocked** by the browser.

---

## 🚀 5. Workflow: Adding a New Feature

When creating a new widget or feature, follow these steps in order:

1.  **Define Types**: Create `features/[name]/types.ts`.
2.  **Create API**: Implement pure functions in `features/[name]/api/[name].api.ts`.
3.  **Implement Controller**: Write the logic in `features/[name]/hooks/use[Name].ts`.
4.  **Build View**: Create the UI in `features/[name]/components/[Name]Widget.tsx`.
5.  **Assemble**: Add the new component to the corresponding `app/` route.

---

> [!NOTE]
> **Why this matters?**
> This architecture ensures that as Blaze grows to include dozens of widgets and complex overlays, the code remains predictable, testable, and robust against authentication errors.
