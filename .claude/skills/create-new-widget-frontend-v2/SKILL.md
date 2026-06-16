---
name: create-new-widget-frontend-v2
description: Scaffolds a complete frontend flow for a new widget in blaze-frontend (v2 workflow): service layer, dashboard configuration page, and OBS overlay page. Use when user wants to create a new widget frontend using the v2 approach, or invokes /create-new-widget-frontend-v2.
---

# Create New Widget Frontend (v2)

## Quick start

Ensure the backend API is ready (or defined), then determine the widget name (e.g. `MyNewWidget` / `my-new-widget`) and follow the checklist.

## Workflow

### 1. Types — `features/[widget-name]/types.ts`
- [ ] Define config interface matching backend response shape
- [ ] Import `ExtendedWidget` from `@/services/widget.service`

```typescript
import { ExtendedWidget } from "@/services/widget.service";

export interface MyNewWidgetConfig {
    id: string;
    some_field: string | null;
    widget: ExtendedWidget;
}
```

### 2. API Layer — `features/[widget-name]/api/[widgetName].api.ts`
- [ ] Import `apiClient` from `@/lib/api-client`
- [ ] Implement `create[WidgetName](twitchId, ownerId)` — POST `/api/v1/[widget]` with `{ twitch_id, owner_id }`
- [ ] Implement `get[WidgetName]Config()` — GET `/api/v1/[widget]`
- [ ] Implement `update[WidgetName]Config(data)` — PUT `/api/v1/[widget]`
- [ ] Add `getEventUrl(userId, key?)` helper if the widget has an overlay SSE stream

```typescript
import { apiClient } from "@/lib/api-client";
import { MyNewWidgetConfig } from "../types";

export const createMyNewWidget = async (twitchId: string, ownerId: string): Promise<MyNewWidgetConfig> => {
    const response = await apiClient.post<MyNewWidgetConfig>("/api/v1/my-new-widget", {
        twitch_id: twitchId,
        owner_id: ownerId,
    });
    return response.data;
};

export const getMyNewWidgetConfig = async (): Promise<MyNewWidgetConfig> => {
    const response = await apiClient.get<MyNewWidgetConfig>("/api/v1/my-new-widget");
    return response.data;
};

export const updateMyNewWidgetConfig = async (data: Partial<MyNewWidgetConfig>): Promise<MyNewWidgetConfig> => {
    const response = await apiClient.put<MyNewWidgetConfig>("/api/v1/my-new-widget", data);
    return response.data;
};
```

### 3. Hook — `features/[widget-name]/hooks/use[WidgetName].ts`
- [ ] Accept `initialConfig` prop
- [ ] Use `useUser()` from `@/components/user-context`
- [ ] Manage state: `config`, `isEnabled`, `isSaving`, `activeTab`, form fields
- [ ] Implement `handleEnable()` — calls create API, updates state, switches to `"settings"` tab
- [ ] Implement `handleSave()` — calls update API, updates config
- [ ] Implement `handleDelete()` — calls `deleteWidget(config.widget.id)` from `@/services/widget.service`, resets state
- [ ] Use `tbToast` from `@/utils/tbToast` for feedback

### 4. Component — `features/[widget-name]/components/[WidgetName]Widget.tsx`
- [ ] `"use client"` directive at top
- [ ] Accept `{ initialConfig }` prop, delegate all state to hook
- [ ] Tab layout: **Overview** (1 col when no config) → **Settings** (2 cols when configured)
- [ ] Use `WidgetConfigLayout` from `@/components/widget/layout/WidgetConfigLayout`
- [ ] Use `WidgetOverviewCard`, `WidgetSettingsCard`, `WidgetSettingsCardContent`, `WidgetSettingsCardFooter`
- [ ] Reuse shared form controls: `TwitchRewardSelector`, `BotProfileSelector`, `ReplyMessageTextarea`
- [ ] Footer: `SaveWidgetButton` + `DeleteWidgetButton`

### 5. Dashboard Page — `app/dashboard/widgets/[widget-slug]/page.tsx`
- [ ] Server component (no `"use client"`)
- [ ] Fetch initial config via `fetchData` from `@/lib/data-access`
- [ ] Return `null` on error (widget renders as unenabled state)
- [ ] Render the client component with `initialConfig`

```typescript
import { fetchData } from "@/lib/data-access";
import { MyNewWidgetConfig } from "@/features/my-new-widget/types";
import { MyNewWidgetWidget } from "@/features/my-new-widget/components/MyNewWidgetWidget";

async function getConfigServer(): Promise<MyNewWidgetConfig | null> {
    try {
        const res = await fetchData<MyNewWidgetConfig>("/api/v1/my-new-widget");
        return res ?? null;
    } catch {
        return null;
    }
}

export default async function MyNewWidgetPage() {
    const config = await getConfigServer();
    return <MyNewWidgetWidget initialConfig={config} />;
}
```

### 6. Widget Registry — `constants/widgets.ts`
- [ ] Import the icon from `lucide-react`
- [ ] Add entry to the `StaticWidgets` array with `slug`, `title`, `description`, `icon`, `href`, `color`, `bgColor`, `borderColor`

```typescript
{
    slug: "my-new-widget",
    title: "My New Widget",
    description: "คำอธิบายภาษาไทย",
    icon: SomeLucideIcon,
    href: "/dashboard/widgets/my-new-widget",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20"
},
```

### 7. Overlay Page (OBS Source) — `app/overlays/[widget-slug]/[userId]/page.tsx`
*Skip this step if the widget has no visual OBS overlay (e.g. chat-only integrations).*

- [ ] `"use client"` directive at top
- [ ] Get `userId` from `useParams()`, `key` from `useSearchParams()`
- [ ] Connect `EventSource` SSE using the `getEventUrl` helper from the API module
- [ ] Implement exponential backoff reconnection (see drop-image overlay as reference)
- [ ] Root div: `w-screen h-screen bg-transparent overflow-hidden`
- [ ] Clean up `eventSource.close()` in `useEffect` return

## Notes

- Use `apiClient` (from `@/lib/api-client`) for all client-side API calls — it handles 401 refresh automatically
- Use `fetchData` (from `@/lib/data-access`) only in server components for SSR hydration
- Overlay background must be transparent for OBS browser source
- `deleteWidget` from `@/services/widget.service` is the shared deletion helper — do not call the DELETE endpoint directly
- See [REFERENCE.md](REFERENCE.md) for full code examples of existing widgets
