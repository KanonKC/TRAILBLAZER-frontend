"use client";

import { NodeProps } from "@xyflow/react";
import { Filter } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

export function ConditionNode({ id, data }: NodeProps) {
    // label is the human-readable name (displayName was renamed to label)
    const displayLabel = data.label as string;
    return (
        <NodeWrapper
            id={id}
            label={displayLabel}
            sublabel="Condition"
            icon={Filter}
            gradientClass="bg-gradient-to-br from-warning to-warning/60"
            borderClass="border border-warning/30"
            sublabelClass="text-warning"
            data={data}
        />
    );
}
