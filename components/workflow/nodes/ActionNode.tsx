import { NodeProps } from "@xyflow/react";
import { Send } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";

export function ActionNode({ id, data }: NodeProps) {
    // label is the human-readable name (displayName was renamed to label)
    const displayLabel = data.label as string;
    const isSendMessage = displayLabel === "Send Message";

    return (
        <NodeWrapper
            id={id}
            label={displayLabel}
            sublabel="Action"
            icon={Send}
            gradientClass="bg-gradient-to-br from-info to-info/60"
            borderClass="border border-info/30"
            sublabelClass="text-info"
            className={isSendMessage ? "w-[300px]" : ""}
            data={data}
        >
            {isSendMessage && (
                <div className="mt-2 text-xs bg-background/20 border border-info/30 rounded p-2 text-foreground min-h-[40px] max-h-[100px] overflow-hidden text-ellipsis line-clamp-3 font-mono cursor-pointer hover:bg-background/30 transition-colors pointer-events-none">
                    {(data.message as string) ? (
                        <span className="break-words">{(data.message as string)}</span>
                    ) : (
                        <span className="text-info/50 italic">Configure message in settings...</span>
                    )}
                </div>
            )}
        </NodeWrapper>
    );
}
