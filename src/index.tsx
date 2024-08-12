import { createSignal, createEffect, JSX, onCleanup } from "solid-js";
import { render } from "solid-js/web";
import "./index.css"; // Import Tailwind CSS
import Canvas from "./Canvas/view";
import {
  convertToFrames,
  generateDeeplyNestedHtml,
  generateLargeHtml,
  renderHtml,
} from "./utils";
import { Frame } from "./Canvas/provider/Frame";

// Usage
function App(): JSX.Element {
  const htmlString = `
  <div class="hello" style="color: red;">
    <div><span>Hello,</span><span><strong>Solid.js</strong></span><span>World!</span></div>
    <div><span>Nested</span><span>Element</span></div>
  </div>
  `;
  // const { frames, components } = convertToFrames(htmlString);
  // const html = renderHtml(frames, components);
  // Stress test parameters

  const depth = 2000; // Adjust the depth as needed for your stress test

  // Generate a deeply nested HTML string
  const deeplyNestedHtmlString = generateDeeplyNestedHtml(depth);

  // Measure the time to convert to frames
  console.time("convertToFrames");
  const { frames, components } = convertToFrames(deeplyNestedHtmlString);
  console.timeEnd("convertToFrames");

  // Measure the time to render HTML
  console.time("renderHtml");
  const renderedHtml = renderHtml(frames, components);
  console.timeEnd("renderHtml");
  return <Canvas html={renderedHtml} />;
}

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <App />, root!);
