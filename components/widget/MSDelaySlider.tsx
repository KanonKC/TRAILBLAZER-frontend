import { Slider } from "@/components/ui/slider";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface MSDelaySliderProps {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    step?: number;
}

export function MSDelaySlider({ 
    value, 
    onChange, 
    max = 15000, 
    step = 1000 
}: MSDelaySliderProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-full pt-3">
                <Slider 
                    value={[value]} 
                    onValueChange={(val) => onChange(val[0])} 
                    max={max}
                    step={step} 
                />
                <div className="flex justify-between text-muted-foreground pt-1">
                    <span className="text-sm">0s</span>
                    <span className="text-sm">{max / 1000}s</span>
                </div>
            </div>
            <div className="w-32">
                <InputGroup>
                    <InputGroupInput 
                        type="number" 
                        value={value} 
                        min={0}
                        max={max}
                        className="font-mono tabular-nums"
                        onChange={(e) => {
                            const parsed = Number(e.target.value);
                            onChange(Number.isFinite(parsed) ? Math.min(max, Math.max(0, Math.round(parsed))) : 0);
                        }}
                    />
                    <InputGroupAddon align="inline-end">ms</InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    );
}
