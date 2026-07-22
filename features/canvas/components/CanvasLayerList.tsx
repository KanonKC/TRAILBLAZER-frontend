"use client"

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CanvasElement } from "../types";
import { Button } from "@/components/ui/button";
import {
    Image as ImageIcon,
    Video,
    Music,
    Type,
    Plus,
    GripVertical,
} from "lucide-react";
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

function SortableLayer({
    element,
    isSelected,
    onSelect,
}: {
    element: CanvasElement;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });
    const Icon = TYPE_ICON[element.type];

    const label = element.type === "text"
        ? (element.text_content || "ข้อความ")
        : element.media?.name ?? element.type;

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            onClick={() => onSelect(element.id)}
            className={`flex items-center gap-1.5 p-2 rounded-md border cursor-pointer text-sm bg-background ${isSelected ? "border-primary bg-primary/5" : "border-muted"
                } ${isDragging ? "opacity-50 z-10" : ""}`}
        >
            <button
                type="button"
                className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground"
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                aria-label="ลากเพื่อเรียงลำดับ"
            >
                <GripVertical className="h-4 w-4" />
            </button>
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate flex-1" title={label}>{label}</span>
        </div>
    );
}

interface CanvasLayerListProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelect: (id: string) => void;
    onReorder: (orderedIdsTopFirst: string[]) => void;
    onAdd: (type: CanvasElement["type"]) => void;
}

export function CanvasLayerList({ elements, selectedElementId, onSelect, onReorder, onAdd }: CanvasLayerListProps) {
    // Highest z_index renders on top, so it sits first in the list.
    const sortedTopFirst = [...elements].sort((a, b) => b.z_index - a.z_index);
    const ids = sortedTopFirst.map((el) => el.id);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;
        const next = [...ids];
        next.splice(newIndex, 0, next.splice(oldIndex, 1)[0]);
        onReorder(next);
    };

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

            {sortedTopFirst.length === 0 && <p className="text-sm text-muted-foreground">ยังไม่มี element ในนี้</p>}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1.5">
                        {sortedTopFirst.map((element) => (
                            <SortableLayer
                                key={element.id}
                                element={element}
                                isSelected={element.id === selectedElementId}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
