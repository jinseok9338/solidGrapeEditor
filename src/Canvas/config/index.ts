import { DEFAULT_COORDS } from "../../utils/consts";
import { CanvasConfig } from "../type";

export const config: CanvasConfig = {
  stylePrefix: "cv-",
  scripts: [],
  defaultCanvasContent: "<!DOCTYPE html>",
  defaultCanvasStyle: `
    body { background-color: #fff }
    * ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1) }
    * ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2) }
    * ::-webkit-scrollbar { width: 10px }
  `,
  currentFrameId: 0,
  frames: [],
  zoom: 100,
  notTextable: ["button", "a", "input[type=checkbox]", "input[type=radio]"],
  allowExternalDrop: true,
  pointer: DEFAULT_COORDS,
  pointerScreen: DEFAULT_COORDS,
  x: 0,
  y: 0,
};
