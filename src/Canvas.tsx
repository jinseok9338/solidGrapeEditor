import { useEditorOptions } from "./context/EditorOptions";
import { createEffect, JSX } from "solid-js";

interface CanvasProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children?: JSX.Element;
}
export default function Canvas({ children, ...rest }: CanvasProps) {
  const editorOptions = useEditorOptions();
  let canvasRef: HTMLDivElement;

  createEffect(() => {
    canvasRef && editorOptions.setRefCanvas(canvasRef);
  });

  return (
    <div {...rest} ref={(el) => (canvasRef = el)}>
      {children}
    </div>
  );
}
