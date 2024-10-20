import React, { useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import {fabric} from "fabric"
import { ActiveTool, Editor, FONT_SIZE, FONT_WEIGHT } from "../../type";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RxTransparencyGrid } from "react-icons/rx";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  ImageIcon,
  Trash,
} from "lucide-react";
import { isTextType } from "../../utils";
import {
  FaBold,
  FaCropSimple,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa6";
import { FontSizeInput } from "../fontsizeInput/fontsizeInput";
import { TbColorFilter } from "react-icons/tb";

interface ToolBarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
const ToolBar = ({ editor, activeTool, onChangeActiveTool }: ToolBarProps) => {
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();
  const fontFamily = editor?.getActiveFontFamily();
  const fontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const fontStyle = editor?.getActiveFontStyle();
  const fontLinethrough = editor?.getActiveFontLinethrough();
  const fontUnderline = editor?.getActiveFontUnderline();
  const textAlign = editor?.getActiveTextAlign();
  const fontSize = editor?.getActiveFontSize() || FONT_SIZE;
  const [properties, setProperties] = useState({
    fillColor,
    strokeColor,
    fontFamily,
    fontWeight,
    fontStyle,
    fontLinethrough,
    fontUnderline,
    textAlign,
    fontSize,
  });
  const selectedObjectType = editor?.selectedObjects[0]?.type;
  //for getting the image inside circle
  const selectImageInsideShape = (() => {
    const fill = editor?.selectedObjects[0]?.get("fill") as fabric.Pattern ;
  
    // Check if the fill is a fabric.Pattern object
    if (fill instanceof fabric.Pattern) {
      return fill.source instanceof HTMLImageElement && "image";
    }
  
    return null;
  })();
  const isSelectedText = isTextType(selectedObjectType);
  const selectedObject = editor?.selectedObjects[0];
  const isImage = selectedObjectType === "image"|| selectImageInsideShape === "image";
  const toggleBold = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontWeight: newValue,
    }));
  };
  const toggleItalic = () => {
    if (!selectedObject) {
      return;
    }

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };
  const toggleLinethrough = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontLinethrough ? false : true;

    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLinethrough: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };
  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      fontAlign: value,
    }));
  };
  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };
  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[58px] border-b w-full flex item-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }
  return (
    <div className="shrink-0 h-[58px] border-b w-full flex item-center overflow-x-auto z-[49] p-2 gap-x-2 font-normal">
      {!isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Color " side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size={"icon"}
              variant={"ghost"}
              className={cn(
                activeTool === "fill" ? "bg-slate-500" : "bg-slate-400"
              )}
            >
              <div
                className="rounded-sm size-4 border "
                style={{
                  backgroundColor: properties.fillColor,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {!isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Stroke Color" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-color")}
              size={"icon"}
              variant={"ghost"}
              className={cn(
                activeTool === "stroke-color" ? "bg-slate-500" : "bg-slate-400"
              )}
            >
              <div
                className="rounded-sm size-4 border-2 bg-white"
                style={{
                  borderColor: properties.strokeColor,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {!isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Stroke width" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-width")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "stroke-width" && "bg-gray-100")}
            >
              <BsBorderWidth className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size="icon"
              variant="ghost"
              className={cn(
                "w-auto px-2 text-sm",
                activeTool === "font" && "bg-gray-100"
              )}
            >
              <div className="max-w-[100px] truncate">
                {properties.fontFamily}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Bold" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleBold}
              size="icon"
              variant="ghost"
              className={cn(properties.fontWeight > 500 && "bg-pink-300")}
            >
              <FaBold className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Italic" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleItalic}
              size="icon"
              variant="ghost"
              className={cn(properties.fontStyle === "italic" && "bg-pink-300")}
            >
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Underline" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleUnderline}
              size="icon"
              variant="ghost"
              className={cn(properties.fontUnderline && "bg-pink-300")}
            >
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Strike" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleLinethrough}
              size="icon"
              variant="ghost"
              className={cn(properties.fontLinethrough && "bg-pink-300")}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align left" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("left")}
              size="icon"
              variant="ghost"
              className={cn(properties.textAlign === "left" && "bg-pink-300")}
            >
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align center" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("center")}
              size="icon"
              variant="ghost"
              className={cn(properties.textAlign === "center" && "bg-pink-300")}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align right" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("right")}
              size="icon"
              variant="ghost"
              className={cn(properties.textAlign === "right" && "bg-pink-300")}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isSelectedText && (
        <div className="flex items-center h-full justify-center">
          <FontSizeInput
            value={properties.fontSize}
            onChange={onChangeFontSize}
          />
        </div>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Filters" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("filter")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "filter" && "bg-gray-100")}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
     
        
     {isImage&&
     <div className="flex item s-center h-full justify-center">
     <Hint label="Replace Image" side="bottom" sideOffset={5}>
       <Button
         onClick={() =>{
           onChangeActiveTool("imageReplace");
         }}
         size="icon"
         variant="ghost"
       >
         <ImageIcon className="size-4" />
       </Button>
     </Hint>
   </div>
     }
    {isImage&&(
       <div className="flex item s-center h-full justify-center">
       <Hint label="Replace Image" side="bottom" sideOffset={5}>
         <Button
           onClick={() =>{
            editor?.enableCropping()
           }}
           size="icon"
           variant="ghost"
         >
          <FaCropSimple className="size-4"/>
         </Button>
       </Hint>
     </div>

    )} 

      
      <div className="flex item s-center h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button onClick={() => editor?.delete()} size="icon" variant="ghost">
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default ToolBar;
