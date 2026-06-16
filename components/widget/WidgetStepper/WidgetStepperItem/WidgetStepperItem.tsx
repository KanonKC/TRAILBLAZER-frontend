import React from 'react'

interface WidgetStepperItemProps {
    step: number;
    drawLine?: boolean;
    title: React.ReactNode;
    children: React.ReactNode;
}

const WidgetStepperItem = ({ step, drawLine = true, title, children }: WidgetStepperItemProps) => {
    return (
        <div key={step} className="flex gap-4 relative pb-10 last:pb-0">
            <div className="flex flex-col items-center">
                <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm z-10 bg-transparent ring-4 ring-transparent">
                    {step}
                </div>
                {drawLine && (
                    <div className="w-[2px] bg-white/10 absolute top-8 bottom-0 left-4 -ml-[1px]" />
                )}
            </div>
            <div className="space-y-1 pt-1 flex-1 min-w-0">
                <h3 className="font-semibold leading-none mb-2 text-white">{title}</h3>
                <div className="text-sm">{children}</div>
            </div>
        </div>
    )
}

export default WidgetStepperItem