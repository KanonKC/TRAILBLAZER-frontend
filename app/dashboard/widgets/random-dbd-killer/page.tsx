import { fetchData } from "@/lib/data-access";
import { RandomDBDKillerConfig } from "@/features/random-dbd-killer/types";
import { RandomDBDKillerWidget } from "@/features/random-dbd-killer/components/RandomDBDKillerWidget";

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
    const config = await getRandomDBDKillerConfigServer();
    return <RandomDBDKillerWidget initialConfig={config} />;
}
