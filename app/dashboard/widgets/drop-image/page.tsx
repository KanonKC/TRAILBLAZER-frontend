import { fetchData } from "@/lib/data-access";
import { DropImageConfig } from "@/features/drop-image/types";
import { DropImageWidget } from "@/features/drop-image/components/DropImageWidget";
import { WidgetTypeMeta } from "@/services/widget.service";

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
    const [config, widgetTypesData] = await Promise.all([
        getDropImageConfigServer(),
        fetchData<{ data: WidgetTypeMeta[] }>("/api/v1/widget-types"),
    ]);
    const widgetType = widgetTypesData?.data.find(w => w.slug === "drop-image");
    if (!widgetType) return null;
    return <DropImageWidget initialConfig={config} widgetType={widgetType} />;
}
