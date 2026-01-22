"use client";

import { NodeProps } from "@xyflow/react";
import { Filter } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

export function ConditionNode({ id, data }: NodeProps) {
    return (
        <NodeWrapper
            id={id}
            label={data.label as string}
            sublabel="Condition"
            icon={Filter}
            gradientClass="bg-gradient-to-br from-amber-600 to-amber-800"
            borderClass="border border-amber-400/30"
            sublabelClass="text-amber-200"
        />
    );
}
