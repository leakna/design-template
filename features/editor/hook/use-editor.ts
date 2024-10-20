import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  SQUARE_OPTIONS,
  TRIANGLE_OPTIONS,
  STAR_OPTIONS,
  DIAMOND_OPTIONS,
  ARROW_OPTIONS,
  LINE_OPTIONS,
  DASHED_LINE_OPTIONS,
  DOTTED_LINE_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  EditorHookProps,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  JSON_KEYS,
} from "@/features/editor/type";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { useCanvasEvents } from "./use-canvas-events";
import {
  createFilter,
  downloadFile,
  isTextType,
  transformText,
} from "../utils";
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./useHistory";
import { useHotkeys } from "./use-hotkeys";
import { useWindowEvents } from "./use-window-event";
import { addEvent, buildObject } from "@/lib/function/functionForAction";
import { Bold } from "lucide-react";

const buildEdior = ({
  arr,
  dataforUpdate,
  changeArr,
  save,
  canRedo,
  canUndo,
  undo,
  redo,
  autoResize,
  copy,
  paste,
  cropperRef,
  setPatternImageSrc,
  setShowCropper,
  canvas,
  setFillColor,
  fontFamily,
  setFontFamily,
  setStrokeColor,
  setStrokeWidth,
  fillColor,
  strokeColor,
  strokeWidth,
  selectedObjects,
}: BuildEditorProps): Editor => {
  const updateData = () => {
    changeArr(dataforUpdate);
    console.log(arr);
  };
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "png");
    autoResize();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "svg");
    autoResize();
  };

  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);

    downloadFile(dataUrl, "jpg");
    autoResize();
  };

  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);

    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`; // to make download recognize it as json
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);

    canvas.loadFromJSON(data, () => {
      autoResize();
    });
  };
  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workSpace = getWorkspace();
    const center = workSpace?.getCenterPoint();
    //@ts-ignore
    canvas._centerObject(object, center);
  };
  const getImage = () => {
    const selectedObject = canvas.getActiveObject() as fabric.Circle;
    const pattern = selectedObject.get("fill") as fabric.Pattern | undefined;
    return { pattern, selectedObject };
  };

  const createPattern = (circleRadius: number, image: any) => {
    const translateX = 0; // No horizontal translation needed
    const translateY = 0;
    const scale = Math.max(
      (circleRadius * 2) / image.width!,
      (circleRadius * 2) / image.height!
    );

    const pattern = new fabric.Pattern({
      source: image.getElement() as HTMLImageElement, // Use the new image as the pattern source
      repeat: "no-repeat",
      patternTransform: [scale, 0, 0, scale, translateX, translateY], // Preserve the existing pattern's transform if any
    });
    return pattern as fabric.Pattern;
  };

  return {
    saveJpg,
    saveJson,
    savePng,
    saveSvg,
    loadJson,
    autoResize,
    canUndo,
    canRedo,
    updateData,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio > 1 ? 1 : zoomRatio
      );
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio
      );
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });

      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") || 1;

      return value;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    //text
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontFamily exists.
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fontFamily;
      }

      // @ts-ignore
      // Faulty TS library, fontFamily exists.
      const value = selectedObject.get("fontFamily") || fontFamily;

      return value;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
      }

      // @ts-ignore
      // Faulty TS library,   exists.
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

      return value;
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontWeight exists.
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      // @ts-ignore
      // Faulty TS library, fontStyle exists.
      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontStyle exists.
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, linethrough exists.
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      // Faulty TS library, linethrough exists.
      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, underline exists.
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      // Faulty TS library, underline exists.
      const value = selectedObject.get("underline") || false;

      return value;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, textAlign exists.
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      // @ts-ignore
      // Faulty TS library, textAlign exists.
      const value = selectedObject.get("textAlign") || "left";
      console.log(value);
      return value;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontSize exists.
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      // @ts-ignore
      // Faulty TS library, fontSize exists.
      const value = selectedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    //delete
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },

    //image
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (image) => {
          //fabirc.image
          const circleRadius = 100; // Radius of 100 pixels, making the circle diameter 200 pixels

          // Create a circle with the desired dimensions and style
          const circle = new fabric.Circle({
            left: 10, // Position from the left
            top: 10, // Position from the top
            radius: circleRadius, // Radius of the circle
            stroke: "red", // Border color
            strokeWidth: 5, // Border thickness
            fill: "", // Placeholder to apply pattern later
          });
          const pattern = createPattern(circleRadius, image);

          // Set the circle's fill to the pattern
          circle.set("fill", pattern);
          addToCanvas(circle);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },
    replaceImage(value: string) {
      fabric.Image.fromURL(
        value,
        (image) => {
          console.log("hello");
          const { pattern, selectedObject } = getImage();

          if (pattern) {
            const circleRadius = 100;
            const newPattern: fabric.Pattern = createPattern(
              circleRadius,
              image
            );

            // Update the circle's fill with the new pattern
            selectedObject.set("fill", newPattern);
          }
          canvas.renderAll();
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },
    enableCropping: () => {
      const { pattern, selectedObject } = getImage();
      if (pattern!.source instanceof HTMLImageElement) {
        const imageSrc = pattern!.source.src;
        setPatternImageSrc(imageSrc);
        setShowCropper(true);
      }
    },
    handleCrop: () => {
      const { selectedObject } = getImage();
      const imageElement: any = cropperRef!;
      const cropper = imageElement?.cropper;
      if (cropper) {
        const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
        fabric.Image.fromURL(
          croppedDataURL,
          (img) => {
            console.log("crop data url", croppedDataURL);
            const circleRadius = 100;
            const newPattern = createPattern(circleRadius, img);
            selectedObject.set("fill", newPattern);
            canvas.renderAll();
            setShowCropper(false);
          },
          {
            crossOrigin: "anonymous",
          }
        );
      } else {
        console.log("Cropper not initialized");
      }
    },
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
    },
    //color
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        if (object.type != "image") {
          object.set({ strokeWidth: value });
        } else {
          const clipCircle = canvas
            .getObjects()
            .find((element) => element.name == "circleForImage");
          if (clipCircle) {
            clipCircle.set({ strokeWidth: value });
          }
        }
      });
      canvas.renderAll();
    },
    //Line
    addLine: () => {
      const line = new fabric.Line([0, 0, 100, 0], {
        ...LINE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(line);
    },
    addDashedLine: () => {
      const dashedLine = new fabric.Line([0, 0, 100, 0], {
        ...DASHED_LINE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(dashedLine);
    },
    addDottedLine: () => {
      const dottedLine = new fabric.Line([0, 0, 100, 0], {
        ...DOTTED_LINE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(dottedLine);
    },
    //Shapes
    addCircle: () => {
      const circle = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(circle);
    },
    addRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 10,
        ry: 10,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(rectangle);
    },
    addSquare: () => {
      const square = new fabric.Rect({
        ...SQUARE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(square);
    },
    addTraingle: () => {
      const triangle = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(triangle);
    },
    addStar: () => {
      const star = new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 60, y: 35 },
          { x: 100, y: 35 },
          { x: 70, y: 57 },
          { x: 80, y: 91 },
          { x: 50, y: 70 },
          { x: 20, y: 91 },
          { x: 30, y: 57 },
          { x: 0, y: 35 },
          { x: 40, y: 35 },
        ],
        {
          ...STAR_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(star);
    },
    addDiamond: () => {
      const diamond = new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 0, y: 50 },
        ],
        {
          ...DIAMOND_OPTIONS,
          left: 200,
          top: 200,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(diamond);
    },
    addArrowRight: () => {
      const arrowRight = new fabric.Polygon(
        [
          { x: 0, y: 50 },
          { x: 100, y: 50 },
          { x: 100, y: 30 },
          { x: 150, y: 70 },
          { x: 100, y: 110 },
          { x: 100, y: 90 },
          { x: 0, y: 90 },
        ],
        {
          ...ARROW_OPTIONS,
          left: 200,
          top: 200,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(arrowRight);
    },
    addArrowLeft: () => {
      const arrowLeft = new fabric.Polygon(
        [
          { x: 150, y: 50 },
          { x: 50, y: 50 },
          { x: 50, y: 30 },
          { x: 0, y: 70 },
          { x: 50, y: 110 },
          { x: 50, y: 90 },
          { x: 150, y: 90 },
        ],
        {
          ...ARROW_OPTIONS,
          left: 200,
          top: 200,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(arrowLeft);
    },
    addArrowUp: () => {
      const arrowUp = new fabric.Polygon(
        [
          { x: 70, y: 150 },
          { x: 70, y: 50 },
          { x: 50, y: 50 },
          { x: 90, y: 0 },
          { x: 130, y: 50 },
          { x: 110, y: 50 },
          { x: 110, y: 150 },
        ],
        {
          ...ARROW_OPTIONS,
          left: 200,
          top: 200,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(arrowUp);
    },
    addArrowDown: () => {
      const arrowDown = new fabric.Polygon(
        [
          { x: 70, y: 0 },
          { x: 70, y: 100 },
          { x: 50, y: 100 },
          { x: 90, y: 150 },
          { x: 130, y: 100 },
          { x: 110, y: 100 },
          { x: 110, y: 0 },
        ],
        {
          ...ARROW_OPTIONS,
          left: 200,
          top: 200,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
        }
      );
      addToCanvas(arrowDown);
    },
    canvas,
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;

      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("stroke") || strokeColor;

      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") || strokeWidth;

      return value;
    },
    strokeWidth,
    selectedObjects,
  };
};

export const useEditor = ({ clearSlercrtionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [cropContainer, setCropContainer] = useState<HTMLDivElement | null>(
    null
  );

  const [setPatternImageSrc, setStatePatternImageSrc] = useState<React.Dispatch<
    React.SetStateAction<any>
  > | null>(null);
  const [setShowCropper, setStateShowCropper] = useState<React.Dispatch<
    React.SetStateAction<any>
  > | null>(null);
  const [cropperRef, setCropper] = useState<HTMLImageElement | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setselectedObjects] = useState<fabric.Object[]>([]);
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const { copy, paste } = useClipboard({ canvas });
  const { autoResize } = useAutoResize({
    canvas,
    container,
  });
  useWindowEvents();
  const { save, canRedo, canUndo, undo, redo, canvasHistory, setHistoryIndex } =
    useHistory({
      canvas,
    });

  useCanvasEvents({
    save,
    canvas,
    setselectedObjects,
    clearSlercrtionCallback,
  });
  useHotkeys({
    undo,
    redo,
    copy,
    paste,
    save,
    canvas,
  });
  
  const [dataforUpdate, setDataforUpdate] = useState<any>({});

  const editor = useMemo(() => {
    if (canvas) {
      return buildEdior({
        save,
        canRedo,
        canUndo,
        undo,
        redo,
        autoResize,
        copy,
        paste,
        cropperRef,
        setPatternImageSrc,
        setShowCropper,
        canvas,
        fillColor,
        strokeColor,
        strokeWidth,
        setFillColor,
        setStrokeWidth,
        setStrokeColor,
        selectedObjects,
        fontFamily,
        setFontFamily,
      });
    }
    return undefined;
  }, [

    save,
    canRedo,
    canUndo,
    undo,
    redo,
    copy,
    paste,
    setPatternImageSrc,
    setShowCropper,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    fontFamily,
    setFontFamily,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
      initSetPatternImageSrc,
      initSetShowCropper,
      initCropper,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
      initSetPatternImageSrc: React.Dispatch<
        React.SetStateAction<string | null>
      >;
      initSetShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
      initCropper: HTMLImageElement | null;
    }) => {
      fabric.Object.prototype.set({
        transparentCorners: false,
        borderColor: "red",
        cornerColor: "blue",
        cornerStyle: "circle",
        cornerStrokeColor: "green",
        cornerSize: 12,
        padding: 5,
        borderOpacityWhenMoving: 1,
        borderScaleFactor: 1.05,
      });

      const initWorkspace = new fabric.Rect({
        width: 620,
        height: 877,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,

        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.9)",
          blur: 5,
        }),
      });

    
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

     initialCanvas.add(initWorkspace)
      initialCanvas.centerObject(initWorkspace);
      initialCanvas.clipPath = initWorkspace; //any element outside of this workspace will not be visible
      setCanvas(initialCanvas);
      setContainer(initialContainer);
      setStatePatternImageSrc(() => initSetPatternImageSrc); //  // Correctly set the state using type assertion if necessary
      setStateShowCropper(() => initSetShowCropper);
      setCropper(initCropper);
      console.log(cropperRef);
      const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [canvasHistory, setHistoryIndex]
  );

  return { init, editor };
};
