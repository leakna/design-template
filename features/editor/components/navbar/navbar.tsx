"use client";
import React from "react";
import { useFilePicker } from "use-file-picker";
import { CiFileOn } from "react-icons/ci";
import { ChevronDown, MousePointerClick, Redo2, Undo2 } from "lucide-react";
import Logo from "@/features/editor/components/logo/Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { BsCloudCheck } from "react-icons/bs";
import { BiExport } from "react-icons/bi";
import { ActiveTool, Editor } from "../../type";
interface NavbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const Navbar = ({ editor, activeTool, onChangeActiveTool }: NavbarProps) => {
  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadJson(reader.result as string);
        };
      }
    },
  });
  return (
    <>
      <nav className="w-full flex items-center p-4 h-[64px] gap-x-8">
        <Logo />
        <div className="w-full items-center gap-x-1 h-full flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                File
                <ChevronDown className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-60">
              <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => openFilePicker()}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>Open</p>
                  <p className="text-xs text-gray-500">Open a file</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="mx-2" />
          <Hint label="Select">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                onChangeActiveTool("select");
              }}
              className={cn(activeTool === "select" && "bg-gray-200")}
            >
              <MousePointerClick className="size-4" />
            </Button>
          </Hint>

          <Separator orientation="vertical" className="mx-2" />

          <Hint label="Undo">
            <Button
              disabled={!editor?.canUndo()}
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor?.onUndo()}
            >
              <Undo2 className="size-4" />
            </Button>
          </Hint>
          <Separator orientation="vertical" className="mx-2" />

          <Hint label="Redo">
            <Button
              disabled={!editor?.canRedo()}
              variant={"ghost"}
              size={"icon"}
              onClick={() => editor?.onRedo()}
            >
              <Redo2 className="size-4" />
            </Button>
          </Hint>
          <Separator orientation="vertical" className="mx-2" />

          <div className="flex items-center gap-x-2">
            <BsCloudCheck className="size-[20px] text-muted-foreground" />
            <div className="text-muted-foreground text-xs">Saved !</div>
            <Button
              onClick={() => {
                editor?.updateData();
              }}
            >
              Save
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-x-4">
            <Hint label="Export the design">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex items-center gap-x-2"
                  >
                    <BiExport className="size-4" />
                    <span>Export</span>
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-60">
                  <DropdownMenuItem
                    className="flex items-center gap-x-2"
                    onClick={() => editor?.saveJson()}
                  >
                    <CiFileOn className="size-4" />
                    <div>
                      <p>JSON</p>
                      <p className="text-xs text-gray-500">
                        Save for editing later
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-x-2"
                    onClick={() => editor?.saveJpg()}
                  >
                    <CiFileOn className="size-4" />
                    <div>
                      <p>JPG</p>
                      <p className="text-xs text-gray-500">Best for sharing</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-x-2"
                    onClick={() => editor?.savePng()}
                  >
                    <CiFileOn className="size-4" />
                    <div>
                      <p>PNG</p>
                      <p className="text-xs text-gray-500">Best for sharing</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-x-2"
                    onClick={() => editor?.saveSvg()}
                  >
                    <CiFileOn className="size-4" />
                    <div>
                      <p>SVG</p>
                      <p className="text-xs text-gray-500">Best for sharing</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Hint>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
