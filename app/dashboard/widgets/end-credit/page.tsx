import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { EndCreditConfig } from "@/features/end-credit/types";
import { EndCreditWidget } from "@/features/end-credit/components/EndCreditWidget";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";

const SLUG = "end-credit";

async function getEndCreditConfigServer(): Promise<EndCreditConfig | null> {
    try {
        const res = await fetchData<EndCreditConfig>("/api/v1/end-credit");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function EndCreditWidgetPage() {
    const [config, widgetType] = await Promise.all([
        getEndCreditConfigServer(),
        getWidgetTypeMeta(SLUG),
    ]);
    if (widgetType === undefined) return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
    if (widgetType === null) return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;
    return <EndCreditWidget initialConfig={config} widgetType={widgetType} />;
}
