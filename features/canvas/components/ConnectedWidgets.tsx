"use client"

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { listWidgets, ExtendedWidget } from "@/services/widget.service";

interface ConnectedWidgetsProps {
    linkedWidgetIds: string[];
    onToggle: (widgetId: string) => void;
}

export function ConnectedWidgets({ linkedWidgetIds, onToggle }: ConnectedWidgetsProps) {
    const [widgets, setWidgets] = useState<ExtendedWidget[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        listWidgets({ limit: 100 })
            .then((res) => setWidgets(res.data))
            .catch((error) => console.error("Failed to load widgets", error))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">กำลังโหลดวิดเจ็ต...</p>;
    }

    if (widgets.length === 0) {
        return <p className="text-sm text-muted-foreground">คุณยังไม่มีวิดเจ็ตที่เปิดใช้งาน</p>;
    }

    return (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
                เลือกวิดเจ็ตที่จะ trigger Canvas นี้ เมื่อวิดเจ็ตนั้นทำงาน
            </p>
            {widgets.map((widget) => (
                <label key={widget.id} className="flex items-center gap-2 p-2 rounded-md border cursor-pointer text-sm">
                    <Checkbox
                        checked={linkedWidgetIds.includes(widget.id)}
                        onCheckedChange={() => onToggle(widget.id)}
                    />
                    <span>{widget.widget_type?.displayName ?? widget.widget_type_slug ?? widget.id}</span>
                </label>
            ))}
        </div>
    );
}
