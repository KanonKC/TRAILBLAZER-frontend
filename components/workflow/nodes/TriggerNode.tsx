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
            gradientClass="bg-gradient-to-br from-purple-600 to-purple-800"
            borderClass="border border-purple-400/30"
            sublabelClass="text-purple-200"
        />
    );
}
