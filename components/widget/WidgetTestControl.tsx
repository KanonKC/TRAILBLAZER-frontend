import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { TestWidgetButton } from "@/components/button/TestWidgetButton";

interface WidgetTestControlProps {
    isSaving: boolean;
    isTesting: boolean;
    onSave: () => void;
    onTest: () => void;
    canTest: boolean;
    canSave?: boolean;
    /** quick-start: Save then Test. settings: Test then Save (Save rightmost). */
    placement?: "quick-start" | "settings";
}

export function WidgetTestControl({ isSaving, isTesting, onSave, onTest, canTest, canSave = true, placement = "quick-start" }: WidgetTestControlProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {placement === "settings" ? (
                <>
                    <TestWidgetButton onTest={onTest} isLoading={isTesting} disabled={!canTest} />
                    <SaveWidgetButton onSave={onSave} isLoading={isSaving} disabled={!canSave} />
                </>
            ) : (
                <>
                    <SaveWidgetButton onSave={onSave} isLoading={isSaving} disabled={!canSave} />
                    <TestWidgetButton onTest={onTest} isLoading={isTesting} disabled={!canTest} />
                </>
            )}
        </div>
    );
}
