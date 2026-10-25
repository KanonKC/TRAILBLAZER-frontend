import { toast } from "sonner";

interface TBToastProps {
    title: string;
    description?: string;
    error?: unknown;
}

function generateParameters(props: TBToastProps): [string, { description?: string }] {
    const { title, description, error } = props;
    if (error && typeof error === "object" && "error_code" in error) {
        const errorCodeLabel = `(code: ${String(error.error_code)})`;
        return [title, { description: description ? `${description} ${errorCodeLabel}` : errorCodeLabel }];
    }
    return [title, { description }];
}

export const tbToast = {
    success: (props: TBToastProps) => toast.success(...generateParameters(props)),
    error: (props: TBToastProps) => {
        const gen = generateParameters(props)
        toast.error(...gen)
    }
}