"use client";

import { NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

export function TriggerNode({ id, data }: NodeProps) {
    return (
        <NodeWrapper
            id={id}
            label={data.label as string}
            sublabel="Trigger"
            icon={Zap}
            gradientClass="bg-gradient-to-br from-purple-600 to-purple-800"
            borderClass="border border-purple-400/30"
            sublabelClass="text-purple-200"
        />
    );
}
