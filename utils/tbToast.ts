import { toast } from "sonner";

interface TBToastProps {
    title: string;
    description?: string;
    error?: unknown;
}

function generateParameters(props: TBToastProps): [string, { description?: string }] {
    const { title, description, error } = props;
    if (error && typeof error === "object" && "error_code" in error) {
        return [title, { description: `${description} (code: ${error.error_code})` }];
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