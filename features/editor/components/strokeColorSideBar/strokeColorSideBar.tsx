import React from "react";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor, STROKE_COLOR } from "@/features/editor/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSideBarHeader from "@/features/editor/components/toolSideBarHeader/ToolSideBarHeader";
import ToolSideBarClose from "@/features/editor/components/toolSideBarClose/ToolSideBarClose";
import { ColorPicker } from "../colorPicker/ColorPicker";

interface StrokeColorSideBarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const StrokeColorSideBar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: StrokeColorSideBarProps) => {
    const value = editor?.getActiveStrokeColor() || STROKE_COLOR;
    const onClose = () => {
        onChangeActiveTool("select");
    };

    const onChange = (value: string) => {
        editor?.changeStrokeColor(value);
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "stroke-color" ? "visible" : "hidden"
            )}
        >
            <ToolSideBarHeader
                title="Stroke Color"
                description="Add stroke color to your Canava Nigger!!!"
            />
            <ScrollArea>
                <div className="p-4 space-y-9">
                    <ColorPicker value={value} onChange={onChange} />
                </div>
            </ScrollArea>

            <ToolSideBarClose onClick={onClose} />
        </aside>
    );
};

export default StrokeColorSideBar;
