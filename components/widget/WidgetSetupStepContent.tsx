import WidgetEnabledBadge from "./WidgetEnabledBadge";
import GoToSettingsButton from "./GoToSettingsButton";
import { SmartOverlayUrlInput } from "./SmartOverlayUrlInput";
import { OBSSetupHelp } from "./OBSSetupHelp";

interface StepContentProps {
    description: string;
}

export function WidgetEnableStepContent({ description }: StepContentProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{description}</p>
            <WidgetEnabledBadge />
        </div>
    );
}

export function WidgetSettingsStepContent({ description, onOpenSettings }: StepContentProps & { onOpenSettings: () => void }) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{description}</p>
            <GoToSettingsButton onClick={onOpenSettings} />
        </div>
    );
}

export function WidgetOverlayStepContent<Config>({
    description,
    url,
    slug,
    onSuccess,
    obsType,
}: StepContentProps & {
    url: string;
    slug: string;
    onSuccess: (data: Config) => void;
    obsType?: "audio" | "image" | "text";
}) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{description}</p>
            <SmartOverlayUrlInput url={url} slug={slug} onSuccess={onSuccess} hideLabel />
            <OBSSetupHelp type={obsType} defaultOpen />
        </div>
    );
}
