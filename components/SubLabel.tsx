"use client"

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SubLabelProps {
    children?: ReactNode;
    className?: string;
}

const SubLabel = ({ children, className }: SubLabelProps) => {
    return (
        <p className={cn("text-sm text-muted-foreground", className)}>
            {children}
        </p>
    )
}

export default SubLabel