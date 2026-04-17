import React from 'react'
import { AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';

interface TrailblazerAccordianTriggerProps {
    children: React.ReactNode;
    variant?: "default" | "overlay";
}

const TrailblazerAccordianTrigger = ({ children, variant = "overlay" }: TrailblazerAccordianTriggerProps) => {
    
    const isOverlay = variant === "overlay";
    
    return (
        <AccordionTrigger className={cn(
            "px-4 py-3 hover:no-underline rounded-t-lg transition-colors cursor-pointer",
            isOverlay
                ? "text-white/90 hover:bg-white/10 data-[state=open]:bg-white/10"
                : "text-foreground hover:bg-muted/50 data-[state=open]:bg-muted/50"
        )}>
            {children}
        </AccordionTrigger>
    )
}

export default TrailblazerAccordianTrigger