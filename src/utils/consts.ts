import { Coordinates } from "../common/type";

export const DEFAULT_COORDS: Coordinates = {
  x: 0,
  y: 0,
};

export const noop = () => {};

export const hasWindow = typeof window !== "undefined";
