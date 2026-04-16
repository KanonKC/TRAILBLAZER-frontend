import { ExportVideoWidget } from "@/features/export-video/components/ExportVideoWidget";
import { ExportVideoConfig } from "@/features/export-video/types";
import { fetchData } from "@/lib/data-access";

async function getExportVideoConfigServer(): Promise<ExportVideoConfig | null> {
    try {
        const res = await fetchData<ExportVideoConfig>("/api/v1/export-video");
        return res;
    } catch {
        return null;
    }
}

export default async function ExportVideoWidgetPage() {
    const config = await getExportVideoConfigServer();
    return <ExportVideoWidget initialConfig={config} />;
}
