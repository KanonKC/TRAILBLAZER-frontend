# Create New Widget Frontend v2 — Full Examples

## Dashboard page skeleton

```typescript
"use client"

import { useState, useEffect } from "react";
import { useUser } from "@/components/user-context";
import { getMyNewWidgetConfig, updateMyNewWidgetConfig } from "@/services/myNewWidget.service";

export default function MyNewWidgetPage() {
    const { user } = useUser();
    const [config, setConfig] = useState(null);

    useEffect(() => {
        if (!user) return;
        getMyNewWidgetConfig().then(setConfig);
    }, [user]);

    const handleSave = async () => {
        // Call update service with current form state
    };

    return (
        <div className="container mx-auto py-10">
            {/* Header */}
            {/* Tabs: Overview | Quick Start | Settings */}
        </div>
    );
}
```

## Overlay page skeleton

```typescript
"use client"

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function MyNewWidgetOverlay() {
    const { userId } = useParams();
    const searchParams = useSearchParams();
    const key = searchParams.get("key");

    useEffect(() => {
        const eventSource = new EventSource(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/my-new-widget/${userId}?key=${key}`
        );
        eventSource.addEventListener("trigger", (event) => {
            // Handle trigger event
        });
        return () => eventSource.close();
    }, [userId, key]);

    return (
        <div className="w-screen h-screen bg-transparent overflow-hidden">
            {/* Overlay content */}
        </div>
    );
}
```
