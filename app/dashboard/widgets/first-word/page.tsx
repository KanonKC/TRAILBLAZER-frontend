import { FirstWordWidget } from "@/features/first-word/components/FirstWordWidget";
import { FirstWordConfig } from "@/features/first-word/types";
import { getWidgetTypeMeta } from "@/lib/data-access";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";
import { cookies } from "next/headers";

const SLUG = "first-word";

interface FirstWordServerResult {
    config: FirstWordConfig | null;
    requiresProPlan: boolean;
}

async function getFirstWordConfigServer(): Promise<FirstWordServerResult> {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

        const res = await fetch(`${baseUrl}/api/v1/first-word`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });

        if (res.status === 403) {
            return { config: null, requiresProPlan: true };
        }

        if (!res.ok) {
            return { config: null, requiresProPlan: false };
        }

        const data = await res.json();
        return { config: data as FirstWordConfig, requiresProPlan: false };
    } catch {
        return { config: null, requiresProPlan: false };
    }
}

export default async function FirstWordWidgetPage() {
    const [{ config, requiresProPlan }, widgetType] = await Promise.all([
        getFirstWordConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <FirstWordWidget initialConfig={config} initialRequiresProPlan={requiresProPlan} widgetType={widgetType} />;
}
