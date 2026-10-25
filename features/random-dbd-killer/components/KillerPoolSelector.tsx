import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";
import { DBDKillerMaster } from "../types";

interface KillerPoolSelectorProps {
    killerMasters: DBDKillerMaster[];
    killerPool: string[];
    onToggle: (slug: string) => void;
    isLoading?: boolean;
}

export function KillerPoolSelector({ killerMasters, killerPool, onToggle, isLoading }: KillerPoolSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [hasClosedPicker, setHasClosedPicker] = useState(false);

    const filteredKillers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return killerMasters;
        return killerMasters.filter((killer) => killer.title.toLowerCase().includes(query));
    }, [killerMasters, search]);

    if (isLoading) {
        return <Skeleton className="h-10 w-full max-w-sm rounded-lg" />;
    }

    if (killerMasters.length === 0) {
        return (
            <p className="text-center text-sm text-muted-foreground">ไม่พบข้อมูล Killer ในขณะนี้</p>
        );
    }

    const selectedKillers = killerMasters.filter((killer) => killerPool.includes(killer.slug));
    const showEmptyPoolError = hasClosedPicker && killerPool.length === 0;
    const isAllFilteredSelected = filteredKillers.length > 0 && filteredKillers.every((killer) => killerPool.includes(killer.slug));

    const handleToggleAll = () => {
        if (isAllFilteredSelected) {
            filteredKillers.forEach((killer) => {
                if (killerPool.includes(killer.slug)) onToggle(killer.slug);
            });
        } else {
            filteredKillers.forEach((killer) => {
                if (!killerPool.includes(killer.slug)) onToggle(killer.slug);
            });
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(true)}
                aria-invalid={showEmptyPoolError || undefined}
                className="w-full justify-between sm:w-auto bg-secondary text-foreground border-border hover:bg-secondary hover:text-primary"
            >
                <span>เลือก Killer</span>
                <span className={cn("text-muted-foreground", selectedKillers.length === 0 && "italic")}>
                    {selectedKillers.length > 0 ? `เลือกแล้ว ${selectedKillers.length} ตัว` : "ยังไม่ได้เลือก"}
                </span>
            </Button>

            {showEmptyPoolError && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    เลือก Killer อย่างน้อย 1 ตัว
                </p>
            )}

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

            <Dialog
                open={isOpen}
                onOpenChange={(nextOpen) => {
                    setIsOpen(nextOpen);
                    if (!nextOpen) setHasClosedPicker(true);
                }}
            >
                <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
                    <DialogHeader className="shrink-0 gap-3 border-b p-6 pb-4">
                        <DialogTitle>เลือก Killer</DialogTitle>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <Input
                                type="text"
                                placeholder="ค้นหา Killer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="sm:max-w-xs"
                            />
                            <Button type="button" variant="outline" size="sm" className="bg-secondary text-foreground border-border hover:bg-secondary hover:text-primary" onClick={handleToggleAll}>
                                {isAllFilteredSelected ? "ไม่เลือกทั้งหมด" : "เลือกทั้งหมด"}
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto p-6">
                        {filteredKillers.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground">ไม่พบ Killer ที่ค้นหา</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {filteredKillers.map((killer) => {
                                    const isSelected = killerPool.includes(killer.slug);
                                    return (
                                        <button
                                            type="button"
                                            key={killer.slug}
                                            onClick={() => onToggle(killer.slug)}
                                            aria-pressed={isSelected}
                                            className={cn(
                                                "relative flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors cursor-pointer",
                                                isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"
                                            )}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    "absolute top-2 right-2 flex size-4 items-center justify-center rounded-[4px] border",
                                                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-secondary"
                                                )}
                                            >
                                                {isSelected && <Check className="size-3" />}
                                            </span>
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
                        )}
                    </div>
                    <DialogFooter className="shrink-0 border-t p-6 pt-4">
                        <Button type="button" onClick={() => { setIsOpen(false); setHasClosedPicker(true); }}>เสร็จสิ้น</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
