import { 
    ActiveTool, 
    Editor, 
    STROKE_WIDTH
  } from "@/features/editor/type";
  import  ToolSideBarClose from "@/features/editor/components/toolSideBarClose/ToolSideBarClose";
  import ToolSideBarHeader  from "@/features/editor/components/toolSideBarHeader/ToolSideBarHeader";
  
  import { cn } from "@/lib/utils";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";
  import { Slider } from "@/components/ui/slider";
  import { ScrollArea } from "@/components/ui/scroll-area";
  
  interface StrokeWidthSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
  };
  
  export const StrokeWidthSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
  }: StrokeWidthSidebarProps) => {
    const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  
    const onClose = () => {
      onChangeActiveTool("select");
    };
  
    const onChangeStrokeWidth = (value: number) => {
      editor?.changeStrokeWidth(value);
    };
  
  
  
    return (
      <aside
        className={cn(
          "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
          activeTool === "stroke-width" ? "visible" : "hidden",
        )}
      >
        <ToolSideBarHeader
          title="Stroke options"
          description="Modify the stroke of your element"
        />
        <ScrollArea>
          <div className="p-4 space-y-4 border-b">
            <Label className="text-sm">
              Stroke width
            </Label>
            <Slider
              value={[widthValue]}
              onValueChange={(values) => onChangeStrokeWidth(values[0])}
            />
          </div>
         
        </ScrollArea>
        <ToolSideBarClose onClick={onClose} />
      </aside>
    );
  };
  