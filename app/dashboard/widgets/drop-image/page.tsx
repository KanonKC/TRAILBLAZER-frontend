import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { DropImageConfig } from "@/features/drop-image/types";
import { DropImageWidget } from "@/features/drop-image/components/DropImageWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "drop-image";

async function getDropImageConfigServer(): Promise<DropImageConfig | null> {
    try {
        const res = await fetchData<DropImageConfig>("/api/v1/drop-image");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function DropImageWidgetPage() {
    const [config, widgetType] = await Promise.all([
        getDropImageConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <DropImageWidget initialConfig={config} widgetType={widgetType} />;
}
