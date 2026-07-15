import { ExportVideoWidget } from "@/features/export-video/components/ExportVideoWidget";
import { ExportVideoConfig } from "@/features/export-video/types";
import { fetchData } from "@/lib/data-access";
import { WidgetTypeMeta } from "@/services/widget.service";

async function getExportVideoConfigServer(): Promise<ExportVideoConfig | null> {
    try {
        const res = await fetchData<ExportVideoConfig>("/api/v1/export-video");
        return res;
    } catch {
        return null;
    }
}

export default async function ExportVideoWidgetPage() {
    const [config, widgetTypesData] = await Promise.all([
        getExportVideoConfigServer(),
        fetchData<{ data: WidgetTypeMeta[] }>("/api/v1/widget-types"),
    ]);
    const widgetType = widgetTypesData?.data.find(w => w.slug === "export-video");
    if (!widgetType) return null;
    return <ExportVideoWidget initialConfig={config} widgetType={widgetType} />;
}
