import { createEffect, JSX } from "solid-js";
import { Component, Frame } from "../provider/Frame";
import { FrameHandler } from "./FrameHandler/FrameHandler";

// Define the type for the Canvas component props
interface CanvasProps {
  frames: Frame[];
  components: Component[];
}

const makeCanvas = (frames: Frame[], components: Component[]): JSX.Element => {
  // make children but need to wrap the each component in FrameHandler
  const children = frames.map((frame) => {
    const component = components.find(
      (component) => component.id === frame.content_id
    );
    if (!component) return null;

    return (
      <FrameHandler name={component.content.tag}>
        {component.content.text}
      </FrameHandler>
    );
  });

  return <>{children}</>;
};

function Canvas(props: Readonly<CanvasProps>): JSX.Element {
  const children = makeCanvas(props.frames, props.components);

  return <div>{children}</div>;
}

export default Canvas;
