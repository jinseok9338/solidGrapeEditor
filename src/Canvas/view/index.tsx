import { createEffect, JSX } from "solid-js";

// Define the type for the Canvas component props
interface CanvasProps {
  html: string;
}

const shadowClass = "shadow-[0_0_0_2px_rgba(59,130,246,1)]";
function Canvas(props: CanvasProps): JSX.Element {
  let ref: HTMLDivElement | undefined;

  createEffect(() => {
    if (ref) {
      // Clear the previous content
      while (ref.firstChild) {
        ref.removeChild(ref.firstChild);
      }
      // Parse HTML string into actual DOM nodes
      const template = document.createElement("template");
      template.innerHTML = props.html.trim();
      const content = template.content;
      ref.appendChild(content);
    }
  });

  return <div ref={ref}></div>;
}

export default Canvas;
