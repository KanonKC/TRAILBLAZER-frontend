import { fetchData } from "@/lib/data-access";
import { WidgetGallery } from "./_components/WidgetGallery";
import { ExtendedWidget } from "@/services/widget.service";

export default async function WidgetsPage() {
    const initialData = await fetchData<{ data: ExtendedWidget[], pagination: any }>('/api/v1/widgets');

    return (
        <div className="container mx-auto py-8">
            

            <WidgetGallery initialData={initialData} />
        </div>
    );
}
