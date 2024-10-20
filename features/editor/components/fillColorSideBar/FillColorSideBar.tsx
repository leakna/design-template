import React from "react";
import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR } from "@/features/editor/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolSideBarHeader from "@/features/editor/components/toolSideBarHeader/ToolSideBarHeader";
import ToolSideBarClose from "@/features/editor/components/toolSideBarClose/ToolSideBarClose";
import { ColorPicker } from "../colorPicker/ColorPicker";

interface FillColorSideBarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const FillColorSideBar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: FillColorSideBarProps) => {
    const value = editor?.getActiveFillColor() || FILL_COLOR;
    const onClose = () => {
        onChangeActiveTool("select");
    };

    const onChange = (value: string) => {
        editor?.changeFillColor(value);
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "fill" ? "visible" : "hidden"
            )}
        >
            <ToolSideBarHeader
                title="Fill Color "
                description="Add fill color to your Canava Nigger!!!"
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

export default FillColorSideBar;
