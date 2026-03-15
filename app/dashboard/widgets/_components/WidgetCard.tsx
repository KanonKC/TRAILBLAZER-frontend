"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ExtendedWidget } from "@/services/widget.service";

interface WidgetCardProps {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    bgColor: string;
    apiWidget?: ExtendedWidget;
    isUpdating: boolean;
    onToggle: (checked: boolean) => void;
}

export const WidgetCard = ({
    slug,
    title,
    description,
    icon: Icon,
    href,
    color,
    bgColor,
    apiWidget,
    isUpdating,
    onToggle
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
                            <Switch
                                checked={isEnabled}
                                onCheckedChange={onToggle}
                                disabled={isUpdating}
                            />
                        </div>
                    )}
                </div>
                <CardDescription className="text-base">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
                <Link href={href} className="text-sm font-medium text-primary hover:underline">
                    Configure Widget →
                </Link>
            </CardContent>
        </Card>
    );
};
