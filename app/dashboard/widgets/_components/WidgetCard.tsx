"use client";

import { Play, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExtendedWidget } from "@/services/widget.service";
import { Button } from "@/components/ui/button";
import { WidgetStatusSwitch } from "@/components/widget/WidgetStatusSwitch";

interface WidgetCardProps {
    slug: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    color: string;
    bgColor: string;
    apiWidget?: ExtendedWidget;
    onSuccess?: () => void;
}

export const WidgetCard = ({
    title,
    description,
    icon: Icon,
    href,
    color,
    bgColor,
    apiWidget,
    onSuccess
}: WidgetCardProps) => {
    const isEnabled = apiWidget?.enabled || false;

    return (
        <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md group relative overflow-hidden">
            <CardHeader>
                <div className="flex items-center gap-4 mb-2 justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl transition-colors">
                            {title}
                        </CardTitle>
                    </div>
                    {apiWidget && (
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
            <CardContent className="mt-auto flex justify-end">
                <Link href={href} className="text-sm font-medium text-primary hover:underline">
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
        </Card>
    );
};
