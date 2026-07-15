import { cookies } from "next/headers";
import { WidgetTypeMeta } from "@/services/widget.service";

export async function fetchData<T>(url: string): Promise<T | null> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
        const res = await fetch(`${baseUrl}${url}`, {
            headers: {
                Cookie: cookieHeader,
            },
            cache: "no-store",
        });


        if (!res.ok) return null;

        const data = await res.json();
        return data as T;
    } catch {
        return [] as T;
    }
}

/**
 * Fetches the metadata row for a single widget type by slug.
 * Returns `undefined` if the fetch failed (so callers can show an error state)
 * vs `null` if the fetch succeeded but no widget type with that slug exists.
 */
export async function getWidgetTypeMeta(slug: string): Promise<WidgetTypeMeta | null | undefined> {
    const widgetTypesData = await fetchData<{ data: WidgetTypeMeta[] }>("/api/v1/widget-types");
    if (!widgetTypesData?.data) return undefined;
    return widgetTypesData.data.find(w => w.slug === slug) ?? null;
}