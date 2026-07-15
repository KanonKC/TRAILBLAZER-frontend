import { ExportVideoWidget } from "@/features/export-video/components/ExportVideoWidget";
import { ExportVideoConfig } from "@/features/export-video/types";
import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "export-video";

async function getExportVideoConfigServer(): Promise<ExportVideoConfig | null> {
    try {
        const res = await fetchData<ExportVideoConfig>("/api/v1/export-video");
        return res;
    } catch {
        return null;
    }
}

export default async function ExportVideoWidgetPage() {
    const [config, widgetType] = await Promise.all([
        getExportVideoConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <ExportVideoWidget initialConfig={config} widgetType={widgetType} />;
}
