import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarIconProps {
    icon: LucideIcon;
    label: string;
    isActive?: boolean;
    onClick: () => void;
}

const SideBarItem = ({
    icon: Icon,
    onClick,
    label,
    isActive,
}: SidebarIconProps) => {
    return (
        <Button
            variant={"ghost"}
            onClick={onClick}
            className={cn(
                "p-2 w-full h-full aspect-video flex items-center flex-col justify-center rounded-none text-gray-900",
                isActive && "bg-pink-600  "
            )}
        >
            <Icon className="shrink-0 stroke-2 size-5" />
            <span className="mt-2 text-xs">{label}</span>
        </Button>
    );
};

export default SideBarItem;
