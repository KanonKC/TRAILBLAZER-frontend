"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { usePathname } from "next/navigation";

export function FloatingSupport() {
    const pathname = usePathname();

    // Hide on overlay pages
    if (pathname?.startsWith("/overlays")) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a 
                            href="https://discord.gg/aH4X6PJ3kt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <Button 
                                size="icon" 
                                className="h-14 w-14 rounded-full shadow-lg trailblazer-gradient hover:scale-110 transition-transform duration-200"
                            >
                                <MessageSquare className="h-6 w-6 text-white" />
                            </Button>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="mb-2">
                        <p>ต้องการความช่วยเหลือ? เข้าร่วม Discord ของเรา</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
