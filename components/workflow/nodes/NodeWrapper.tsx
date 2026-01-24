"use client";

import { createContext, useContext, useState } from "react";
import { NodeToolbar, Handle, Position } from "@xyflow/react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { NodeConfigurationModal } from "../NodeConfigurationModal";

// Context for node operations
export const NodeActionsContext = createContext<{
    deleteNode: (id: string) => void;
    updateNodeLabel: (id: string, label: string) => void;
    updateNodeData: (id: string, data: any) => void;
} | null>(null);

export interface NodeWrapperProps {
    id: string;
    children?: React.ReactNode;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    gradientClass: string;
    borderClass: string;
    sublabelClass: string;
    className?: string;
    data?: any;
}

export function NodeWrapper({
    id,
    children,
    label,
    sublabel,
    icon: Icon,
    gradientClass,
    borderClass,
    sublabelClass,
    className,
    data = {},
}: NodeWrapperProps) {
    const actions = useContext(NodeActionsContext);
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [editValue, setEditValue] = useState(label);
    const [showModal, setShowModal] = useState(false);

    const handleSaveEdit = () => {
        if (actions && editValue.trim()) {
            actions.updateNodeLabel(id, editValue.trim());
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditValue(label);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSaveEdit();
        } else if (e.key === "Escape") {
            handleCancelEdit();
        }
    };

    return (
        <>
            <div
                className="relative pt-8 -mt-8"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onDoubleClick={() => setShowModal(true)}
            >
                <NodeToolbar
                    isVisible={isHovered || isEditing}
                    position={Position.Top}
                    className="flex gap-1"
                >
                    <button
                        onClick={() => setShowModal(true)}
                        className="p-1.5 rounded bg-background/90 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 transition-colors"
                        title="ตั้งค่า"
                    >
                        <Pencil className="w-3 h-3" />
                    </button>
                    {/* Pencil is now setting, maybe use Cog? keeping Pencil as requested "edit button" */}
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded bg-background/90 border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                        title="เปลี่ยนชื่อ"
                    >
                        {/* Using a text icon or different icon for rename if Pencil is used for modal? 
                             Let's keep Pencil for rename, and maybe Settings/Cog for modal? 
                             User said: "open modal on double-click or edit button".  
                             Let's assume the existing edit button was just for rename? 
                             I'll add a separate Settings button or hijack the edit button.
                             Let's add a Settings button.
                         */}
                        <span className="text-[10px] font-bold">RENAME</span>
                    </button>
                    <button
                        onClick={() => actions?.deleteNode(id)}
                        className="p-1.5 rounded bg-background/90 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="ลบ"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </NodeToolbar>

                <Handle type="target" position={Position.Left} className="!bg-purple-400 !w-3 !h-3 !border-2 !border-background" />

                <div className={`px-4 py-3 rounded-lg ${gradientClass} text-white shadow-lg ${borderClass} min-w-[150px] ${className || ""}`}>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {isEditing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="bg-white/20 rounded px-1 py-0.5 text-sm font-medium w-24 outline-none"
                                />
                                <button onClick={handleSaveEdit} className="p-0.5 hover:bg-white/20 rounded">
                                    <Check className="w-3 h-3" />
                                </button>
                                <button onClick={handleCancelEdit} className="p-0.5 hover:bg-white/20 rounded">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <span className="font-medium text-sm">{label}</span>
                        )}
                    </div>
                    <div className={`text-xs ${sublabelClass} mt-1`}>{sublabel}</div>
                    {children}
                </div>

                <Handle type="source" position={Position.Right} className="!bg-purple-400 !w-3 !h-3 !border-2 !border-background" />
            </div>

            {/* Modal */}
            {actions && (
                <NodeConfigurationModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    nodeId={id}
                    nodeType={sublabel} // sublabel usually contains "Trigger" or "Action"
                    nodeLabel={label}
                    nodeData={data} // Pass actual data
                    updateNodeData={actions.updateNodeData}
                />
            )}
        </>
    );
}
