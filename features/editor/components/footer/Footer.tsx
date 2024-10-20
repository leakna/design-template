import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Minimize, ZoomIn, ZoomOut } from "lucide-react";
import React from "react";
import { Editor } from "../../type";
interface FooterProps {
    editor: Editor | undefined;
  };
  
const Footer = ({ editor }: FooterProps) => {
    return (
        <>
            <footer className="h-[52px] border-t bg-pink-500 w-full flex item-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse ">
            <Hint label="Reset" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.autoResize()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <Minimize className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom in" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.zoomIn()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomIn className="size-4" />
        </Button>
      </Hint>
      <Hint label="Zoom out" side="top" sideOffset={10}>
        <Button
          onClick={() => editor?.zoomOut()}
          size="icon"
          variant="ghost"
          className="h-full"
        >
          <ZoomOut className="size-4" />
        </Button>
      </Hint>
            </footer>
        </>
    );
};

export default Footer;
