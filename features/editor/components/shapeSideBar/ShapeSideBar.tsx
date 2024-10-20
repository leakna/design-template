import React from "react";
import { cn } from "@/lib/utils";

import { ActiveTool, Editor } from "@/features/editor/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoRemoveOutline, IoStar, IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";

import {
    FaCircle,
    FaLongArrowAltDown,
    FaLongArrowAltLeft,
    FaLongArrowAltRight,
    FaLongArrowAltUp,
    FaSquare,
    FaSquareFull,
} from "react-icons/fa";
import ToolSideBarHeader from "@/features/editor/components/toolSideBarHeader/ToolSideBarHeader";
import ToolSideBarClose from "@/features/editor/components/toolSideBarClose/ToolSideBarClose";
import ShapeTool from "@/features/editor/components/shapeTool/ShapeTool";
import { CgBorderStyleDotted } from "react-icons/cg";
import { TbLineDotted } from "react-icons/tb";
interface ShapeSideBarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const ShapeSideBar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: ShapeSideBarProps) => {
    const onClose = () => {
        onChangeActiveTool("select");
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
                activeTool === "shapes" ? "visible" : "hidden"
            )}
        >
            <ToolSideBarHeader
                title="Line"
                description="Add line to your Canvas"
            />
            <ScrollArea>
                <div className="grid grid-cols-3">
                    <ShapeTool
                        onClick={() => editor?.addLine()}
                        icon={IoRemoveOutline}
                    />
                    <ShapeTool
                        onClick={() => editor?.addDashedLine()}
                        icon={CgBorderStyleDotted}
                    />
                    <ShapeTool
                        onClick={() => editor?.addDottedLine()}
                        icon={TbLineDotted}
                    />
                </div>
            </ScrollArea>

            <ToolSideBarHeader
                title="Shapes"
                description="Add shape to your Canava Nigger!!!"
            />
            <ScrollArea>
                <div className="grid grid-cols-3">
                    <ShapeTool
                        onClick={() => editor?.addCircle()}
                        icon={FaCircle}
                    />
                    <ShapeTool
                        onClick={() => editor?.addRectangle()}
                        icon={FaSquare}
                    />
                    <ShapeTool
                        onClick={() => editor?.addSquare()}
                        icon={FaSquareFull}
                    />
                    <ShapeTool
                        onClick={() => editor?.addTraingle()}
                        icon={IoTriangle}
                    />
                    <ShapeTool
                        onClick={() => editor?.addStar()}
                        icon={IoStar}
                    />

                    <ShapeTool
                        onClick={() => editor?.addDiamond()}
                        icon={FaDiamond}
                    />
                    <ShapeTool
                        onClick={() => editor?.addArrowRight()}
                        icon={FaLongArrowAltRight}
                    />
                    <ShapeTool
                        onClick={() => editor?.addArrowLeft()}
                        icon={FaLongArrowAltLeft}
                    />
                    <ShapeTool
                        onClick={() => editor?.addArrowUp()}
                        icon={FaLongArrowAltUp}
                    />
                    <ShapeTool
                        onClick={() => editor?.addArrowDown()}
                        icon={FaLongArrowAltDown}
                    />
                </div>
            </ScrollArea>

            <ToolSideBarClose onClick={onClose} />
        </aside>
    );
};

export default ShapeSideBar;
