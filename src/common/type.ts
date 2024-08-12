import { JSX } from "solid-js/jsx-runtime";

//
export interface Component {
  tag: string;
  // name has to be unique
  name: string;
  classes: string[];
  //traits: Trait[];
  content: string;
  // if locked, the component cannot be moved, resized, deleted, etc.
  locked: boolean;
  resizable: boolean;
  draggable: boolean;
  selectable: boolean;
  droppable: boolean;
  style: Style;

  updateComponent(data: ComponentConfig): void;
  getTag(): string;
  getName(): string;
  getStyle(): Style;
  // get the updated style
  setStyle(style: Style): Style;
}

export type ComponentConfig = Omit<
  Component,
  "tag" | "getName" | "getStyle" | "setStyle"
>;

export type Trait = {};

export type Style = JSX.CSSProperties;

export interface Coordinates {
  x: number;
  y: number;
}
