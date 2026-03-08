import { fetchData } from "@/lib/data-access";
import { DropImageConfig } from "@/services/dropImage.service";
import { DropImageWidgetClient } from "./_components/DropImageWidgetClient";
import { TierGuard } from "@/components/tier-guard";

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
    const config = await getDropImageConfigServer();
    return (
        <TierGuard requiredTier={1} featureName="Drop Image Widget">
            <DropImageWidgetClient initialConfig={config} />
        </TierGuard>
    );
}
