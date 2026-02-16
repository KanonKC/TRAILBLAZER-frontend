---
description: Create complete frontend flow for a new widget
---

This workflow guides you through creating the frontend components for a new widget in the `blaze-frontend` project. It covers the service layer, dashboard configuration page, and the overlay page.

## Prerequisites
-   Ensure the backend API for your widget is ready (or at least defined).
-   Determine the name of your widget (e.g., `MyNewWidget`).

## 1. Service Layer

Create the service to handle API communication with the backend.

1.  **Create File**: `src/services/[widgetName].service.ts`
2.  **Define Interfaces**:
    -   Define the configuration interface (matching the backend response).
    -   Define any request payloads.
3.  **Implement Functions**:
    -   `get[WidgetName]Config()`
    -   `update[WidgetName]Config()`
    -   `enable[WidgetName]()`
    -   `refresh[WidgetName]Key()` (if applicable)

    **Example (`src/services/[widgetName].service.ts`):**
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
        } catch (error) {
            return null;
        }
    };
    
    export const updateMyNewWidgetConfig = async (data: Partial<MyNewWidgetConfig>): Promise<MyNewWidgetConfig | null> => {
        try {
            const { data: response } = await api.put("/api/v1/my-new-widget", data);
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    ```

## 2. Dashboard Configuration Page

Create the page where users configure the widget settings.

1.  **Create Directory**: `app/dashboard/widgets/[widget-slug]/`
2.  **Create File**: `page.tsx`
3.  **Implement UI**:
    -   Use `useEffect` to fetch the config on mount.
    -   Use state to manage form fields.
    -   Use Shadcn UI components (`Card`, `Button`, `Input`, `Switch`, `Tabs`).
    -   Implement `handleSave`, `handleEnable`, etc.

    **Structure Recommendation:**
    -   **Header**: Title and description.
    -   **Tabs**:
        -   **Overview**: Explanation of the widget.
        -   **Quick Start**: Step-by-step guide (if complex).
        -   **Settings**: Full configuration form.

    **Example (`app/dashboard/widgets/[widget-slug]/page.tsx`):**
    ```typescript
    "use client"
    
    import { useState, useEffect } from "react";
    import { useUser } from "@/components/user-context";
    import { getMyNewWidgetConfig, updateMyNewWidgetConfig } from "@/services/[widgetName].service";
    // ... imports
    
    export default function MyNewWidgetPage() {
        const { user } = useUser();
        const [config, setConfig] = useState(null);
        
        useEffect(() => {
             // Fetch config
        }, [user]);
        
        const handleSave = async () => {
             // Call update service
        };
        
        return (
            <div className="container mx-auto py-10">
                {/* UI Components */}
            </div>
        );
    }
    ```

## 3. Overlay Page (OBS Source)

Create the page that will be loaded in OBS as a Browser Source.

1.  **Create Directory**: `app/overlays/[widget-slug]/[userId]/`
2.  **Create File**: `page.tsx`
3.  **Implement Logic**:
    -   Use `EventSource` (SSE) or polling to listen for events.
    -   Render the visual elements or play audio based on events.
    -   Ensure the background is transparent.

    **Example (`app/overlays/[widget-slug]/[userId]/page.tsx`):**
    ```typescript
    "use client"
    
    import { useEffect, useState } from "react";
    import { useParams, useSearchParams } from "next/navigation";
    
    export default function MyNewWidgetOverlay() {
        const { userId } = useParams();
        const searchParams = useSearchParams();
        const key = searchParams.get("key");
        
        useEffect(() => {
            const eventSource = new EventSource(\`\${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/my-new-widget/\${userId}?key=\${key}\`);
            
            eventSource.addEventListener("trigger", (event) => {
                // Handle event
            });
            
            return () => eventSource.close();
        }, [userId, key]);
        
        return (
             // Transparent container
            <div className="w-screen h-screen bg-transparent overflow-hidden">
                {/* Overlay Content */}
            </div>
        );
    }
    ```
