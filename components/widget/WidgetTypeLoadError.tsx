interface WidgetTypeLoadErrorProps {
    slug: string;
    reason: "fetch-failed" | "not-found";
}

export function WidgetTypeLoadError({ slug, reason }: WidgetTypeLoadErrorProps) {
    const message = reason === "fetch-failed"
        ? "Failed to load widget settings. Please refresh the page."
        : `This widget ("${slug}") is not available.`;

    return (
        <div className="container mx-auto py-8">
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}
