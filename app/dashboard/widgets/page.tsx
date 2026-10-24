import { fetchData } from "@/lib/data-access";
import { WidgetGallery } from "./_components/WidgetGallery";
import { ExtendedWidget, WidgetTypeMeta } from "@/services/widget.service";

export default async function WidgetsPage() {
    const [initialData, widgetTypesData, currentUser] = await Promise.all([
        fetchData<{ data: ExtendedWidget[], pagination: any }>('/api/v1/widgets'),
        fetchData<{ data: WidgetTypeMeta[] }>('/api/v1/widget-types'),
        fetchData<{ is_whitelisted: boolean }>('/api/v1/user/me'),
    ]);

    return (
        <div className="container mx-auto py-8">


            <WidgetGallery initialData={initialData} initialWidgetTypes={widgetTypesData?.data || []} isWhitelisted={currentUser?.is_whitelisted === true} />
        </div>
    );
}
