import React from 'react'
import { AccordionContent } from '../ui/accordion'
import { cn } from '@/lib/utils'

interface TrailblazerAccordianContentProps {
    children: React.ReactNode;
    variant?: "default" | "overlay";
    type?: "audio" | "image" | "text"
}

const TrailblazerAccordianContent = ({ children, variant = "overlay", type = "audio" }: TrailblazerAccordianContentProps) => {

    return (
        <AccordionContent className="px-4 pb-4 pt-3">
            {children}
        </AccordionContent>
    )
}

export default TrailblazerAccordianContent