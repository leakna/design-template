import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

export interface HintProps {
    label: string;
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
}

const Hint = ({
    label,
    children,
    side = "bottom",
    align = "center",
    sideOffset = 0,
    alignOffset = 0,
}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <div>{children}</div>
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                    className="text-white bg-slate-800 border-s-slate-800"
                >
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Hint;
