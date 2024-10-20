import React from "react";
import SideBarItem from "@/features/editor/components/sidebar/sideBar-item";
import {
    LayoutTemplate,
    ImageIcon,
    Shapes,
    Sparkle,
    Type,
    Settings,
} from "lucide-react";
import { ActiveTool } from "@/features/editor/type";
interface SidebarProps {
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
    return (
        <aside className="bg-white  text-white flex flex-col w-[100px] h-full border-r overflow-t-auto  ">
            <ul className="flex flex-col">
                <SideBarItem
                    icon={LayoutTemplate}
                    label="Design"
                    isActive={activeTool === "templates"}
                    onClick={() => {
                        onChangeActiveTool("templates");
                    }}
                />
                <SideBarItem
                    icon={ImageIcon}
                    label="Image"
                    isActive={activeTool === "images"}
                    onClick={() => {
                        onChangeActiveTool("images");
                    }}
                />
                <SideBarItem
                    icon={Type}
                    label="Text"
                    isActive={activeTool === "text"}
                    onClick={() => {
                        onChangeActiveTool("text");
                    }}
                />
                <SideBarItem
                    icon={Shapes}
                    label="Shape"
                    isActive={activeTool === "shapes"}
                    onClick={() => {
                        onChangeActiveTool("shapes");
                    }}
                />
                <SideBarItem
                    icon={Sparkle}
                    label="AI"
                    isActive={activeTool === "ai"}
                    onClick={() => {
                        onChangeActiveTool("ai");
                    }}
                />
                <SideBarItem
                    icon={Settings}
                    label="Settings"
                    isActive={activeTool === "settings"}
                    onClick={() => {
                        onChangeActiveTool("settings");
                    }}
                />
            </ul>
        </aside>
    );
};

export default Sidebar;
