import { createSignal, createEffect, JSX, onCleanup } from "solid-js";
import { render } from "solid-js/web";
import "./index.css"; // Import Tailwind CSS
import Canvas from "./Canvas/view";
import {
  convertToFramesAndComponents,
  generateDeeplyNestedHtml,
  generateLargeHtml,
  renderHtml,
} from "./utils";
import { Frame } from "./Canvas/provider/Frame";
import { FrameHandler } from "./Canvas/view/FrameHandler/FrameHandler";

// Usage
function App(): JSX.Element {
  return (
    <div class="w-[300px]">
      <FrameHandler name="Frame Name" />
    </div>
  );
}

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <App />, root!);
