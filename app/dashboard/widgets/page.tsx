import { fetchData } from "@/lib/data-access";
import { WidgetGallery } from "./_components/WidgetGallery";
import { ExtendedWidget, WidgetTypeMeta } from "@/services/widget.service";

export default async function WidgetsPage() {
    const widgetTypesData = await fetchData<{ data: WidgetTypeMeta[] }>('/api/v1/widget-types');
    const currentUser = await fetchData<{ is_whitelisted: boolean }>('/api/v1/user/me');
    const isAuthenticated = typeof currentUser?.is_whitelisted === "boolean";
    const initialData = isAuthenticated
        ? await fetchData<{ data: ExtendedWidget[], pagination: any }>('/api/v1/widgets')
        : null;

    return (
        <div className="container mx-auto py-8">


            <WidgetGallery initialData={initialData} initialWidgetTypes={widgetTypesData?.data || []} isAuthenticated={isAuthenticated} isWhitelisted={currentUser?.is_whitelisted === true} />
        </div>
    );
}
