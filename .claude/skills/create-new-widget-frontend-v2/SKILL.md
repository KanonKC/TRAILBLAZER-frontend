---
name: create-new-widget-frontend-v2
description: Scaffolds a complete frontend flow for a new widget in blaze-frontend (v2 workflow): service layer, dashboard configuration page, and OBS overlay page. Use when user wants to create a new widget frontend using the v2 approach, or invokes /create-new-widget-frontend-v2.
---

# Create New Widget Frontend (v2)

## Quick start

Ensure the backend API is ready (or defined), then determine the widget name (e.g. `MyNewWidget` / `my-new-widget`) and follow the checklist.

## Workflow

### 1. Service Layer — `src/services/[widgetName].service.ts`
- [ ] Define config interface matching backend response
- [ ] Implement `get[WidgetName]Config()` — GET from `/api/v1/[widget]`
- [ ] Implement `update[WidgetName]Config()` — PUT to `/api/v1/[widget]`
- [ ] Implement `enable[WidgetName]()` if applicable
- [ ] Implement `refresh[WidgetName]Key()` if applicable

```typescript
import { api } from "@/lib/api";

export interface MyNewWidgetConfig {
    id: string;
    enabled: boolean;
    // ... other fields
}

export const getMyNewWidgetConfig = async (): Promise<MyNewWidgetConfig | null> => {
    try {
        const { data } = await api.get("/api/v1/my-new-widget");
        return data;
    } catch {
        return null;
    }
};
```

### 2. Dashboard Config Page — `app/dashboard/widgets/[widget-slug]/page.tsx`
- [ ] `"use client"` directive at top
- [ ] `useEffect` to fetch config on mount (depends on `user` from `useUser()`)
- [ ] State for form fields
- [ ] Implement `handleSave`, `handleEnable` handlers
- [ ] Use Shadcn UI: `Card`, `Button`, `Input`, `Switch`, `Tabs`
- [ ] Tab structure: **Overview** → **Quick Start** (if complex) → **Settings**

### 3. Overlay Page (OBS Source) — `app/overlays/[widget-slug]/[userId]/page.tsx`
- [ ] `"use client"` directive at top
- [ ] Get `userId` from `useParams()`, `key` from `useSearchParams()`
- [ ] Connect `EventSource` SSE to `/api/v1/events/[widget]/[userId]?key=[key]`
- [ ] Listen for `"trigger"` event and update UI state
- [ ] Clean up `eventSource.close()` in `useEffect` return
- [ ] Root div: `w-screen h-screen bg-transparent overflow-hidden`

```typescript
useEffect(() => {
    const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/my-new-widget/${userId}?key=${key}`
    );
    eventSource.addEventListener("trigger", (event) => { /* handle */ });
    return () => eventSource.close();
}, [userId, key]);
```

## Notes

- Overlay background must be transparent for OBS browser source
- Always return `null` (not throw) from service functions on error
- See [REFERENCE.md](REFERENCE.md) for full page examples
