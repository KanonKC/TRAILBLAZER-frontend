import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { cn } from '@/lib/utils'

interface TrailblazerAccordianProps {
    className?: string;
    variant?: "default" | "overlay";
    defaultOpen?: boolean;
    children: React.ReactNode;
}

const TrailblazerAccordian = ({ className, variant = "overlay", defaultOpen = false, children }: TrailblazerAccordianProps) => {

    const isOverlay = variant === "overlay";

    return (
        <Accordion type="single" collapsible defaultValue={!!defaultOpen ? "obs-setup" : undefined} className={cn("w-full border rounded-lg mt-3", isOverlay ? "bg-white/5 border-white/10" : "bg-card border-border", className)}>
            <AccordionItem value="obs-setup" className="border-none">
                {children}
            </AccordionItem>
        </Accordion>
    )
}

export default TrailblazerAccordian