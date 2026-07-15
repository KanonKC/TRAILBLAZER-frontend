import { fetchData } from "@/lib/data-access";
import { RandomDBDKillerConfig } from "@/features/random-dbd-killer/types";
import { RandomDBDKillerWidget } from "@/features/random-dbd-killer/components/RandomDBDKillerWidget";
import { WidgetTypeMeta } from "@/services/widget.service";

async function getRandomDBDKillerConfigServer(): Promise<RandomDBDKillerConfig | null> {
    try {
        const res = await fetchData<RandomDBDKillerConfig>("/api/v1/random-dbd-killer");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function RandomDBDKillerWidgetPage() {
    const [config, widgetTypesData] = await Promise.all([
        getRandomDBDKillerConfigServer(),
        fetchData<{ data: WidgetTypeMeta[] }>("/api/v1/widget-types"),
    ]);
    const widgetType = widgetTypesData?.data.find(w => w.slug === "random-dbd-killer");
    if (!widgetType) return null;
    return <RandomDBDKillerWidget initialConfig={config} widgetType={widgetType} />;
}
