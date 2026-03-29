import { fetchData } from "@/lib/data-access";
import { RandomDbdPerkConfig } from "@/features/random-dbd-perk/types";
import { RandomDbdPerkWidget } from "@/features/random-dbd-perk/components/RandomDbdPerkWidget";

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
    const config = await getRandomDbdPerkConfigServer();
    return <RandomDbdPerkWidget initialConfig={config} />;
}
