import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DBDKillerMaster } from "../types";

interface KillerPoolSelectorProps {
    killerMasters: DBDKillerMaster[];
    killerPool: string[];
    onToggle: (slug: string) => void;
    isLoading?: boolean;
}

export function KillerPoolSelector({ killerMasters, killerPool, onToggle, isLoading }: KillerPoolSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (isLoading) {
        return <Skeleton className="h-10 w-full max-w-sm rounded-lg" />;
    }

    if (killerMasters.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">ไม่พบข้อมูล Killer ในขณะนี้</p>
        );
    }

    const selectedKillers = killerMasters.filter((killer) => killerPool.includes(killer.slug));

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="w-full justify-between sm:w-auto"
            >
                <span>เลือก Killer</span>
                <span className="text-muted-foreground">
                    {selectedKillers.length > 0 ? `เลือกแล้ว ${selectedKillers.length} ตัว` : "ยังไม่ได้เลือก"}
                </span>
            </Button>

            {selectedKillers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedKillers.map((killer) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={killer.slug}
                            src={killer.image_url}
                            alt={killer.title}
                            title={killer.title}
                            className="h-10 w-10 rounded-md object-cover border border-border"
                        />
                    ))}
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>เลือก Killer</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {killerMasters.map((killer) => {
                            const isSelected = killerPool.includes(killer.slug);
                            return (
                                <button
                                    type="button"
                                    key={killer.slug}
                                    onClick={() => onToggle(killer.slug)}
                                    className={cn(
                                        "relative flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors cursor-pointer",
                                        isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent/5"
                                    )}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => onToggle(killer.slug)}
                                        className="absolute top-2 right-2"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={killer.image_url}
                                        alt={killer.title}
                                        className="h-16 w-16 rounded-md object-cover"
                                    />
                                    <span className="text-sm font-medium leading-tight">{killer.title}</span>
                                </button>
                            );
                        })}
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setIsOpen(false)}>เสร็จสิ้น</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
