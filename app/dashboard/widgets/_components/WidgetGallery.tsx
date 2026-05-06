"use client";

import { ExtendedWidget, listWidgets } from "@/services/widget.service";
import { tbToast } from "@/utils/tbToast";
import { useState } from "react";
import { WidgetCard } from "./WidgetCard";
import { StaticWidgets } from "@/constants/widgets";
import { QuotaMeter } from "@/components/widget/QuotaMeter";

interface WidgetGalleryProps {
    initialData: { data: ExtendedWidget[], pagination: any } | null;
}

export const WidgetGallery = ({ initialData }: WidgetGalleryProps) => {
    const [apiWidgets, setApiWidgets] = useState<ExtendedWidget[]>(initialData?.data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [quotaRefreshKey, setQuotaRefreshKey] = useState(0);

    const fetchWidgets = async () => {
        try {
            const res = await listWidgets();
            setApiWidgets(res.data);
            setQuotaRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Failed to fetch widgets", error);
            tbToast.error({ title: "ไม่สามารถดึงข้อมูลวิดเจ็ตได้" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && apiWidgets.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[200px] bg-muted rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-row items-start justify-between gap-2 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Widget Gallery</h1>
                    <p className="text-muted-foreground">
                        เลือกวิดเจ็ตที่คุณต้องการใช้งานเพื่อเสริมประสบการณ์การสตรีมของคุณ
                    </p>
                </div>
                <div className="w-[410px]">
                    <QuotaMeter refreshKey={quotaRefreshKey} />
                </div>
            </div>
            <div className="flex flex-col gap-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {StaticWidgets.map((widget) => {
                        const apiWidget = apiWidgets.find(w => w.widget_type_slug === widget.slug);
                        return (
                            <WidgetCard
                                key={widget.slug}
                                {...widget}
                                apiWidget={apiWidget}
                                onSuccess={fetchWidgets}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
