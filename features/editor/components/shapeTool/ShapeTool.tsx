import React from "react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface ShapeToolProps {
    onClick: () => void;
    icon: LucideIcon | IconType;
    iconClassName?: string;
}

const ShapeTool = ({ onClick, icon: Icon, iconClassName }: ShapeToolProps) => {
    return (
        <button
            className="aspect-square border rounded-md p-5"
            onClick={onClick}
        >
            <Icon className={cn("h-full w-full ", iconClassName)} />
        </button>
    );
};

export default ShapeTool;
