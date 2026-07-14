"use client";

import { Play, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExtendedWidget, WidgetTypeMeta } from "@/services/widget.service";
import { Button } from "@/components/ui/button";
import { WidgetStatusSwitch } from "@/components/widget/WidgetStatusSwitch";

interface WidgetCardProps {
    widgetType: WidgetTypeMeta;
    apiWidget?: ExtendedWidget;
    onSuccess?: () => void;
}

export const WidgetCard = ({
    widgetType,
    apiWidget,
    onSuccess
}: WidgetCardProps) => {
    const { display_name: title, description, icon_url, href, theme_color, is_active: isActive } = widgetType;
    const isEnabled = apiWidget?.enabled || false;

    return (
        <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md group relative overflow-hidden">
            {!isActive && (
                <div className="absolute inset-0 bg-black/40 z-10 rounded-[inherit]" />
            )}
            <CardHeader>
                <div className="flex items-center gap-4 mb-2 justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${theme_color}1a`, color: theme_color ?? undefined }}
                        >
                            {icon_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={icon_url} alt={title} className="w-6 h-6" />
                            ) : (
                                <div className="w-6 h-6" />
                            )}
                        </div>
                        <CardTitle className="text-xl transition-colors">
                            {title}
                        </CardTitle>
                    </div>
                    {apiWidget && isActive && (
                        <div onClick={(e) => e.preventDefault()}>
                            <WidgetStatusSwitch
                                widgetId={apiWidget.id}
                                isEnabled={isEnabled}
                                onSuccess={onSuccess}
                            />
                        </div>
                    )}
                </div>
                <CardDescription className="text-base">
                    {description}
                </CardDescription>
                {apiWidget?.widget_type?.cost !== undefined && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-sm font-medium text-amber-600">
                            <Zap className="h-3 w-3" />
                            {apiWidget.widget_type.cost} พอยท์
                        </span>
                    </div>
                )}
            </CardHeader>
            {isActive && (
                <CardContent className="mt-auto flex justify-end">
                    <Link href={href ?? "#"} className="text-sm font-medium text-primary hover:underline">
                        <Button
                            variant={!apiWidget ? "default" : "outline"}
                        >
                            {
                                apiWidget ? (
                                    <>
                                        <Settings />
                                        ตั้งค่าวิดเจ็ต
                                    </>
                                ) : (
                                    <>
                                        <Play />
                                        เปิดใช้งานวิดเจ็ต
                                    </>
                                )
                            }
                        </Button>
                    </Link>
                </CardContent>
            )}
            {!isActive && (
                <div className="relative z-20 mx-4 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-2 text-sm text-amber-400 text-center">
                    วิดเจ็ตนี้ถูกปิดใช้งานชั่วคราว
                </div>
            )}
        </Card>
    );
};
