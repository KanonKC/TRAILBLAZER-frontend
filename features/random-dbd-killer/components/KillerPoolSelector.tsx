import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DBDKillerMaster } from "../types";

interface KillerPoolSelectorProps {
    killerMasters: DBDKillerMaster[];
    killerPool: string[];
    onToggle: (slug: string) => void;
    isLoading?: boolean;
}

export function KillerPoolSelector({ killerMasters, killerPool, onToggle, isLoading }: KillerPoolSelectorProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (killerMasters.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">ไม่พบข้อมูล Killer ในขณะนี้</p>
        );
    }

    return (
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
    );
}
