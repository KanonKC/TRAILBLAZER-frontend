"use client"

import { CanvasElement } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Image as ImageIcon, Video, Music, Type, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TYPE_ICON: Record<CanvasElement["type"], React.ComponentType<{ className?: string }>> = {
    image: ImageIcon,
    video: Video,
    audio: Music,
    text: Type,
};

interface CanvasLayerListProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelect: (id: string) => void;
    onMove: (id: string, direction: "up" | "down") => void;
    onAdd: (type: CanvasElement["type"]) => void;
}

export function CanvasLayerList({ elements, selectedElementId, onSelect, onMove, onAdd }: CanvasLayerListProps) {
    const sorted = elements.slice().sort((a, b) => b.z_index - a.z_index);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Layers</h4>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" />เพิ่ม</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAdd("image")}><ImageIcon className="h-4 w-4 mr-2" />รูปภาพ</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAdd("video")}><Video className="h-4 w-4 mr-2" />วิดีโอ</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAdd("audio")}><Music className="h-4 w-4 mr-2" />เสียง</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAdd("text")}><Type className="h-4 w-4 mr-2" />ข้อความ</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {sorted.length === 0 && <p className="text-sm text-muted-foreground">ยังไม่มี element ในนี้</p>}

            {sorted.map((element) => {
                const Icon = TYPE_ICON[element.type];
                const isSelected = element.id === selectedElementId;
                return (
                    <div
                        key={element.id}
                        onClick={() => onSelect(element.id)}
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer text-sm ${isSelected ? "border-primary bg-primary/5" : "border-muted"}`}
                    >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate flex-1">
                            {element.type === "text" ? (element.text_content || "Text") : element.media?.name ?? element.type}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onMove(element.id, "up"); }}>
                            <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onMove(element.id, "down"); }}>
                            <ArrowDown className="h-3 w-3" />
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}
