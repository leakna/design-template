import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Loader, Upload } from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/type";
import ToolSideBarClose from "@/features/editor/components/toolSideBarClose/ToolSideBarClose";
import ToolSideBarHeader from "@/features/editor/components/toolSideBarHeader/ToolSideBarHeader";

import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadThing";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" || activeTool=== "imageReplace" ? "visible" : "hidden"
      )}
    >
      <ToolSideBarHeader
        title="Images"
        description="Add images to your canvas"
      />
      <div className="p-4 border-b">
        <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader" //from core
          onClientUploadComplete={(res) => {
            console.log("Upload response:", res); // Log the entire response
            if (res && res[0]) {
              if(activeTool=="images")
                editor?.addImage(res[0].url); // Add image to the editor
              else
                editor?.replaceImage(res[0].url); 
            } else {
              console.error('Invalid response:', res);
            }
          }}
          onUploadError={(error) => {
            console.error('Upload Error:', error);
          }}
        />
      </div>

      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
