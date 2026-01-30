import { AlertTriangle } from "lucide-react";

export default function OverlayNotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-transparent">
            <div className="bg-background/90 border border-border p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 max-w-sm text-center">
                <div className="p-3 bg-destructive/10 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-xl font-bold">Overlay Not Found</h1>
                    <p className="text-sm text-muted-foreground">
                        The overlay URL is invalid, expired, or you do not have permission to view it.
                    </p>
                </div>
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded w-full">
                    Please check the URL in your streaming software or generate a new one from your dashboard.
                </div>
            </div>
        </div>
    );
}
