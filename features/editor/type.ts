import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
import * as material from "material-colors";
export const JSON_KEYS = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension",
];
export const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Palatino",
  "Bookman",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Geneva",
  "Lucida Console",
];
export const selectionDependentTools = [
  "fill",
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "storke-color",
  "storke-width",
];

export const color = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.grey["500"],
  material.blueGrey["500"],
  "transparent",
];
export const filters = [
  "none",
  "polaroid",
  "sepia",
  "kodachrome",
  "contrast",
  "brightness",
  "greyscale",
  "brownie",
  "vintage",
  "technicolor",
  "pixelate",
  "invert",
  "blur",
  "sharpen",
  "emboss",
  "removecolor",
  "blacknwhite",
  "vibrance",
  "blendcolor",
  "huerotate",
  "resize",
  "saturation",
  "gamma",
];
export type ActiveTool =
  //SideBarItem
  | "templates"
  | "images"
  | "text"
  | "shapes"
  | "ai"
  | "settings"
  //Item
  | "select"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "imageReplace"
  | "remove-bg";

// ShapeSideBar
export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 1;
export const COMMON_WIDTH_HEIGHT = {
  width: 200,
  height: 200,
};
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const FONT_WEIGHT = 400;

export const COMMON_LINE_OPTIONS = {
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  left: 100,
  top: 100,
  angle: 0,
};
export const COMMON_SHAPE_OPTIONS = {
  ...COMMON_WIDTH_HEIGHT,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  left: 200,
  top: 200,
  angle: 0,
};
//Line
export const LINE_OPTIONS = {
  ...COMMON_LINE_OPTIONS,
};

export const DASHED_LINE_OPTIONS = {
  ...COMMON_LINE_OPTIONS,
  strokeDashArray: [5, 5],
};

export const DOTTED_LINE_OPTIONS = {
  ...COMMON_LINE_OPTIONS,
  strokeDashArray: [5, 5],
};
//text
export const TEXT_OPTIONS = {
  type: "textbox",
  left: 100,
  top: 100,
  width: 300,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
  backgroundColor: "lightyellow",
  borderColor: "red",
  hasControls: true,
};
//Shape
export const CIRCLE_OPTIONS = {
  radius: 100,
  ...COMMON_SHAPE_OPTIONS,
};

export const RECTANGLE_OPTIONS = {
  ...COMMON_SHAPE_OPTIONS,
};

export const SQUARE_OPTIONS = {
  ...COMMON_SHAPE_OPTIONS,
};

export const TRIANGLE_OPTIONS = {
  ...COMMON_SHAPE_OPTIONS,
};

export const STAR_OPTIONS = {
  ...COMMON_SHAPE_OPTIONS,
};

export const DIAMOND_OPTIONS = {
  ...COMMON_SHAPE_OPTIONS,
};

export const ARROW_OPTIONS = {
  ...COMMON_SHAPE_OPTIONS,
};

export interface EditorHookProps {
  clearSlercrtionCallback?: () => void;
}

export type BuildEditorProps = {
  arr: any;
  dataforUpdate: any;
  changeArr: React.Dispatch<React.SetStateAction<any>>;
  save: (skip?: boolean) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  undo: () => void;
  redo: () => void;
  autoResize: () => void;
  copy: () => void;
  paste: () => void;
  setPatternImageSrc: React.Dispatch<React.SetStateAction<string|null>>;
  setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
  cropperRef: HTMLImageElement | null;
  canvas: fabric.Canvas;
  selectedObjects: fabric.Object[];
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily: string;
  setFontFamily: (value: string) => void;
  setFillColor: (value: string) => void;
  setStrokeColor: (valur: string) => void;
  setStrokeWidth: (value: number) => void;
};

export interface Editor {
  
  updateData: () => void;
  savePng: () => void;
  saveJpg: () => void;
  saveSvg: () => void;
  saveJson: () => void;
  loadJson: (json: string) => void;
  canRedo: () => boolean;
  canUndo: () => boolean;
  onUndo: () => void;
  onRedo: () => void;
  autoResize: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  changeImageFilter: (value: string) => void;
  addImage: (value: string) => void;
  replaceImage: (value: string) => void;
  enableCropping:()=>void;
  handleCrop:()=>void
  delete: () => void;
  changeFontSize: (value: number) => void;
  getActiveFontSize: () => number;
  changeTextAlign: (value: string) => void;
  getActiveTextAlign: () => string;
  changeFontUnderline: (value: boolean) => void;
  getActiveFontUnderline: () => boolean;
  changeFontLinethrough: (value: boolean) => void;
  getActiveFontLinethrough: () => boolean;
  changeFontStyle: (value: string) => void;
  getActiveFontStyle: () => string;
  changeFontWeight: (value: number) => void;
  getActiveFontWeight: () => number;
  getActiveFontFamily: () => string;
  changeFontFamily: (value: string) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  getActiveOpacity: () => number;
  changeOpacity: (value: number) => void;
  bringForward: () => void;
  sendBackwards: () => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  canvas: fabric.Canvas;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  strokeWidth: number;
  selectedObjects: fabric.Object[];

  //Line
  addLine: () => void;
  addDashedLine: () => void;
  addDottedLine: () => void;
  //Shapes
  addCircle: () => void;
  addRectangle: () => void;
  addSquare: () => void;
  addTraingle: () => void;
  addStar: () => void;
  addDiamond: () => void;
  addArrowRight: () => void;
  addArrowLeft: () => void;
  addArrowUp: () => void;
  addArrowDown: () => void;
}
