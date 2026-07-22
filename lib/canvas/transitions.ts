import { CanvasTransition } from "@/features/canvas/types";

interface TransitionClasses {
    enter: string;
    exit: string;
}

const TRANSITION_MAP: Record<CanvasTransition, TransitionClasses> = {
    "fade": { enter: "animate-in fade-in", exit: "animate-out fade-out" },
    "slide-up": { enter: "animate-in slide-in-from-bottom fade-in", exit: "animate-out slide-out-to-top fade-out" },
    "slide-down": { enter: "animate-in slide-in-from-top fade-in", exit: "animate-out slide-out-to-bottom fade-out" },
    "slide-left": { enter: "animate-in slide-in-from-right fade-in", exit: "animate-out slide-out-to-left fade-out" },
    "slide-right": { enter: "animate-in slide-in-from-left fade-in", exit: "animate-out slide-out-to-right fade-out" },
    "zoom": { enter: "animate-in zoom-in fade-in", exit: "animate-out zoom-out fade-out" },
    "pop": { enter: "animate-in zoom-in-50 fade-in", exit: "animate-out zoom-out-50 fade-out" },
    "none": { enter: "", exit: "" },
};

export function getTransitionClass(transition: CanvasTransition, phase: "enter" | "exit"): string {
    return TRANSITION_MAP[transition]?.[phase] ?? TRANSITION_MAP.fade[phase];
}
