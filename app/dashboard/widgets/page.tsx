import { fetchData } from "@/lib/data-access";
import { WidgetGallery } from "./_components/WidgetGallery";
import { ExtendedWidget } from "@/services/widget.service";

export default async function WidgetsPage() {
    const initialData = await fetchData<{ data: ExtendedWidget[], pagination: any }>('/api/v1/widgets');

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Widget Gallery</h1>
                <p className="text-muted-foreground">
                    เลือกวิดเจ็ตที่คุณต้องการใช้งานเพื่อเสริมประสบการณ์การสตรีมของคุณ
                </p>
            </div>

            <WidgetGallery initialData={initialData} />
        </div>
    );
}
