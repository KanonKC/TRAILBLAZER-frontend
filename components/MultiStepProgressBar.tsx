import { JSX } from 'react';

export interface MultiStepProgressBarProps {
    data: {
        step: number;
        title: string;
        description: JSX.Element;
    }
    drawConnector?: boolean
}

const MultiStepProgressBar = ({ data, drawConnector = false }: MultiStepProgressBarProps) => {

    return (
        <div key={data.step} className="flex gap-4 relative pb-10 last:pb-0">
            <div className="flex flex-col items-center">
                <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold text-sm z-10 bg-transparent ring-4 ring-transparent">
                    {data.step}
                </div>
                {drawConnector && (
                    <div className="w-[2px] bg-white/10 absolute top-8 bottom-0 left-4 -ml-[1px]" />
                )}
            </div>
            <div className="space-y-1 pt-1 flex-1 min-w-0">
                <h3 className="font-semibold leading-none mb-2 text-white">{data.title}</h3>
                <div className="text-sm">{data.description}</div>
            </div>
        </div>
    )
}

export default MultiStepProgressBar