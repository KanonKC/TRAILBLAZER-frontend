import { fetchData } from "@/lib/data-access";
import { RandomDbdPerkConfig } from "@/features/random-dbd-perk/types";
import { RandomDbdPerkWidget } from "@/features/random-dbd-perk/components/RandomDbdPerkWidget";
import { WidgetTypeMeta } from "@/services/widget.service";

async function getRandomDbdPerkConfigServer(): Promise<RandomDbdPerkConfig | null> {
    try {
        const res = await fetchData<RandomDbdPerkConfig>("/api/v1/random-dbd-perk");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function RandomDbdPerkWidgetPage() {
    const [config, widgetTypesData] = await Promise.all([
        getRandomDbdPerkConfigServer(),
        fetchData<{ data: WidgetTypeMeta[] }>("/api/v1/widget-types"),
    ]);
    const widgetType = widgetTypesData?.data.find(w => w.slug === "random-dbd-perk");
    if (!widgetType) return null;
    return <RandomDbdPerkWidget initialConfig={config} widgetType={widgetType} />;
}
