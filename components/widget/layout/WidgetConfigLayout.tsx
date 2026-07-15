"use client"

import React, { useState, ReactNode } from "react"
import { QuotaMeter } from "../QuotaMeter"
import { WidgetTypeMeta } from "@/services/widget.service"

interface WidgetConfigLayoutProps {
    children: (props: { triggerRefresh: () => void, refreshKey: number }) => ReactNode
    widgetType: WidgetTypeMeta
}

export function WidgetConfigLayout({
    children,
    widgetType
}: WidgetConfigLayoutProps) {
    const [refreshKey, setRefreshKey] = useState(0)
    const { display_name: title, description, icon_url, theme_color } = widgetType

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="container relative mx-auto py-10 flex flex-col items-center">
            {/* Quota Meter at the top */}
            <div className="flex items-center self-end absolute">
                <div className="w-[250px]">
                    <QuotaMeter refreshKey={refreshKey} />
                </div>
            </div>

            {/* Header */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${theme_color}1a`, color: theme_color ?? undefined }}
                    >
                        {icon_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={icon_url} alt={title} className="w-6 h-6" />
                        ) : (
                            <div className="w-6 h-6" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    {description}
                </p>
            </div>

            {/* Children Content */}
            <div className="w-full max-w-2xl">
                {children({ triggerRefresh, refreshKey })}
            </div>
        </div>
    )
}
