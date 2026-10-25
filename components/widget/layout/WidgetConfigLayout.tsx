"use client"

import React, { useState, ReactNode } from "react"
import { QuotaMeter } from "../QuotaMeter"
import { WidgetTypeMeta } from "@/services/widget.service"

interface WidgetConfigLayoutProps {
    children: (props: { triggerRefresh: () => void, refreshKey: number }) => ReactNode
    widgetType: WidgetTypeMeta
    /** Widens the content column (e.g. for pages with a side preview panel). */
    wide?: boolean
    /** Bump this from the page to re-fetch the quota meter. */
    quotaRefreshKey?: number
    /** Shown under the quota meter in the right-hand column from lg up (e.g. a live preview). */
    aside?: ReactNode
}

export function WidgetConfigLayout({
    children,
    widgetType,
    wide = false,
    quotaRefreshKey = 0,
    aside
}: WidgetConfigLayoutProps) {
    const [refreshKey, setRefreshKey] = useState(0)
    const { display_name: title, description, icon_url, theme_color } = widgetType

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className="container relative mx-auto px-4 py-10 flex flex-col items-center">
            {/* Quota Meter at the top */}
            <div className={aside ? "flex items-center w-full mb-4 lg:hidden" : "flex items-center w-full mb-4 lg:mb-0 lg:w-auto lg:self-end lg:absolute lg:right-4"}>
                <div className="w-full lg:w-[250px]">
                    <QuotaMeter refreshKey={refreshKey + quotaRefreshKey} />
                </div>
            </div>
            {aside && (
                <div className="hidden lg:flex absolute right-4 top-10 bottom-10 w-[250px] flex-col gap-4">
                    <QuotaMeter refreshKey={refreshKey + quotaRefreshKey} />
                    <div className="sticky top-4">{aside}</div>
                </div>
            )}

            {/* Header */}
            <div className={wide ? "w-full max-w-[1016px] mb-8" : "w-full max-w-2xl mb-8"}>
                <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="p-2 rounded-lg"
                        style={theme_color ? { backgroundColor: `${theme_color}1a`, color: theme_color } : undefined}
                    >
                        {icon_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={icon_url}
                                alt={title}
                                className="w-6 h-6"
                                onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                            />
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
            </div>

            {/* Children Content */}
            <div className={wide ? "w-full max-w-[1016px]" : "w-full max-w-2xl"}>
                {children({ triggerRefresh, refreshKey })}
            </div>
        </div>
    )
}
