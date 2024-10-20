import { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  setselectedObjects: (object: fabric.Object[]) => void;
  clearSlercrtionCallback?: () => void;
}

export const useCanvasEvents = ({
  save,
  canvas,
  setselectedObjects,
  clearSlercrtionCallback,
}: UseCanvasEventProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => {
        const activeObject = canvas.getActiveObject();
        // More general check using 'text' in the object type
        if (activeObject && activeObject.type?.includes("text")) {
          const originalFontSize = (activeObject as fabric.Textbox).fontSize;
          const scaleX = activeObject.scaleX || 1; // Scale factor in X direction
          const scaleY = activeObject.scaleY || 1; // Scale factor in Y direction

          // Calculate the effective font size based on the scaling factors
          const effectiveFontSize = Math.round(originalFontSize! * Math.min(scaleX, scaleY));

          console.log("Original font size:", originalFontSize);
          console.log("Effective font size after scaling:", effectiveFontSize);
        } else {
          console.log(
            "No active text object or the object is not a text type."
          );
        }
        save();
      });
      canvas.on("selection:created", (e) => {
        console.log("Selected:created");
        setselectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        console.log("Selection:cleared");
        setselectedObjects([]);
        clearSlercrtionCallback?.();
      });
      canvas.on("selection:updated", (e) => {
        console.log("Selection:updated");
        setselectedObjects(e.selected || []);
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
        canvas.off("selected:created");
        canvas.off("selection:cleared");
        canvas.off("selection:updated");
      }
    };
  }, [save, canvas, setselectedObjects, clearSlercrtionCallback]);
};
