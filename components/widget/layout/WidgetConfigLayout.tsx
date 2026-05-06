"use client"

import React, { useState, ReactNode } from "react"
import { QuotaMeter } from "../QuotaMeter"

interface WidgetConfigLayoutProps {
    children: (props: { triggerRefresh: () => void, refreshKey: number }) => ReactNode
    title: string
    description: string
    icon: ReactNode
    iconClassName?: string
}

export function WidgetConfigLayout({
    children,
    title,
    description,
    icon,
    iconClassName = "bg-blue-500/10 text-blue-500"
}: WidgetConfigLayoutProps) {
    const [refreshKey, setRefreshKey] = useState(0)

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
                    <div className={`p-2 rounded-lg ${iconClassName}`}>
                        {icon}
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
