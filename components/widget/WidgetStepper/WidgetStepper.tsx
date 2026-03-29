import React from 'react';

export interface WidgetStep {
    step: number;
    title: string;
    description: React.ReactNode;
}

interface WidgetStepperProps {
    children: React.ReactNode;
}

export const WidgetStepper = ({ children }: WidgetStepperProps) => {
    return (
        <div className="space-y-0">
            {children}
        </div>
    );
};
