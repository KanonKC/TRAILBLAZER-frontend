"use client";

import { NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

export function TriggerNode({ id, data }: NodeProps) {
    // label is the human-readable name (displayName was renamed to label)
    const displayLabel = data.label as string;
    return (
        <NodeWrapper
            id={id}
            label={displayLabel}
            sublabel="Trigger"
            icon={Zap}
            gradientClass="bg-gradient-to-br from-primary to-orange-600"
            borderClass="border border-primary/30"
            sublabelClass="text-primary/20"
            data={data}
        />
    );
}
