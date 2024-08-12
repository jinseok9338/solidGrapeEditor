import { createContext, JSX } from "solid-js";
import { config } from "../config";
import { createStore } from "solid-js/store";
import { Coordinates } from "../../common/type";
import { noop } from "lodash";
import { CanvasConfig } from "../type";

type CanvasContextType = {
  // this context has all the functions for modifying the canvas
  onChangeZoom: (zoom: number) => void;
  onCoordinatesChange: (coords: Coordinates) => void;
  onPointerChange: (coords: Coordinates) => void;
  canvas: CanvasConfig;
};

const initialCanvasContext: CanvasContextType = {
  onChangeZoom: noop,
  onCoordinatesChange: noop,
  onPointerChange: noop,
  canvas: config,
};

const CanvasContext = createContext<CanvasContextType>(initialCanvasContext);

export const useCanvas = () => CanvasContext;

export const CanvasProvider = (props: { children: JSX.Element }) => {
  const [canvas, setCanvas] = createStore(config);

  const updateCanvas = (data: Partial<CanvasConfig>) => {
    setCanvas((prevCanvas) => ({ ...prevCanvas, ...data }));
  };

  const onChangeZoom = (zoom: number) => {
    updateCanvas({ zoom });
  };

  const onCoordinatesChange = (coords: Coordinates) => {
    updateCanvas({ pointerScreen: coords });
  };

  const onPointerChange = (coords: Coordinates) => {
    updateCanvas({ pointer: coords });
  };

  const value = {
    canvas: canvas,
    onChangeZoom,
    onCoordinatesChange,
    onPointerChange,
  };
  return (
    <CanvasContext.Provider value={value}>
      {props.children}
    </CanvasContext.Provider>
  );
};
