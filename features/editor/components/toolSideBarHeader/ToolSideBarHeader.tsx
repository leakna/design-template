import React from "react";

interface ToolSideBarHeaderProps {
    title: string;
    description?: string;
}

const ToolSideBarHeader = ({ title, description }: ToolSideBarHeaderProps) => {
    return (
        <div className="p-4 border-b space-y-1 h-[68px]">
            <p className="text-sm font-medium">{title}</p>
            {description && (
                <p className="text-xs text-muted-foreground ">{description}</p>
            )}
        </div>
    );
};

export default ToolSideBarHeader;
