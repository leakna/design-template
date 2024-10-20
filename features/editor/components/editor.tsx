"use client";
import { fabric } from "fabric";
import { Cropper } from "react-cropper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActiveTool, selectionDependentTools } from "@/features/editor/type";
import { useEditor } from "@/features/editor/hook/use-editor";
import Navbar from "@/features/editor/components/navbar/navbar";
import Sidebar from "@/features/editor/components/sidebar/sidebar";
import ToolBar from "@/features/editor/components/toolbar/ToolBar";
import Footer from "@/features/editor/components/footer/Footer";
import ShapeSideBar from "@/features/editor/components/shapeSideBar/ShapeSideBar";
import FillColorSideBar from "./fillColorSideBar/FillColorSideBar";
import StrokeColorSideBar from "./strokeColorSideBar/strokeColorSideBar";
import { StrokeWidthSidebar } from "./strokeWidthSideBar/strokeWidthSideBar";
import { OpacitySidebar } from "./opacitySidebar/opacitySidebar";
import { TextSidebar } from "./textSidebar/textSidebar";
import { FontSidebar } from "./fontSidebar/fontSidebar";
import { ImageSidebar } from "./imageSidebar/imageSidebar";
import { FilterSidebar } from "./filterSidebar/filterSidebar";

function Editor() {
  const [patternImageSrc, setPatternImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false); // State to control cropper visibility
  const cropperRef = useRef<HTMLImageElement>(null);
  // const [cropperRef, setCropperRef] =
  //   useState<React.RefObject<HTMLImageElement> | null>(React.createRef());
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }
      if (tool === "draw") {
        // Todo
      }
      if (activeTool === "draw") {
        // Todo
      }

      setActiveTool(tool);
    },

    [activeTool]
  );

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    clearSlercrtionCallback: onClearSelection,
  });

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    console.log("useEffect main cropper", cropperRef);
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
      initSetPatternImageSrc: setPatternImageSrc,
      initSetShowCropper: setShowCropper,
      initCropper: cropperRef!.current,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex ">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <ToolBar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            ref={containerRef}
            className="flex-1 h-[calc(100%-124px)] bg-muted"
          >
            <canvas ref={canvasRef} />
          </div>
          {/* Cropping container */}

          <div
            id="cropping-container"
            style={{ display: showCropper ? "block" : "none" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50"
          >
            <Cropper
              src={patternImageSrc!} // Use the extracted pattern image as the source for Cropper
              style={{ height: 400, width: "100%" }}
              aspectRatio={1} // Set the aspect ratio to 1 (square cropping)
              guides={true} // Show the grid guides in the cropping box
              ref={cropperRef}
              viewMode={1} // Restrict crop box to within the canvas
              autoCropArea={0.8} // Initial cropping area set to 80%
              background={false} // Disable background image behind crop box
            />
            <div className="flex flex-row justify-around">
              <button
                id="apply-crop"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={() => {
                  editor?.handleCrop();
                }}
              >
                Apply Crop
              </button>
              <button
                id="Close"
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => {
                  setShowCropper(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
}

export default Editor;
