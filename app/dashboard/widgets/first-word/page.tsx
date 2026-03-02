import { fetchData } from "@/lib/data-access";
import { FirstWordConfig } from "@/services/firstWord.service";
import { FirstWordWidgetClient } from "./_components/FirstWordWidgetClient";

async function getFirstWordConfigServer(): Promise<FirstWordConfig | null> {
    try {
        const res = await fetchData<FirstWordConfig>("/api/v1/first-word");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function FirstWordWidgetPage() {
    const config = await getFirstWordConfigServer();
    return <FirstWordWidgetClient initialConfig={config} />;
}
