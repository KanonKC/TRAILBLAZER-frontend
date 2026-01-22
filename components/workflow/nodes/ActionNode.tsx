"use client";

import { NodeProps } from "@xyflow/react";
import { Send } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

export function ActionNode({ id, data }: NodeProps) {
    return (
        <NodeWrapper
            id={id}
            label={data.label as string}
            sublabel="Action"
            icon={Send}
            gradientClass="bg-gradient-to-br from-blue-600 to-blue-800"
            borderClass="border border-blue-400/30"
            sublabelClass="text-blue-200"
        />
    );
}
