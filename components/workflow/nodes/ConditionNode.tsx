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
            gradientClass="bg-gradient-to-br from-amber-600 to-amber-800"
            borderClass="border border-amber-400/30"
            sublabelClass="text-amber-200"
            data={data}
        />
    );
}
