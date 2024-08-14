import clsx, { ClassValue } from "clsx";
import { Component, Frame } from "../Canvas/provider/Frame";
import { twMerge } from "tailwind-merge";

const withWrapperHtml = (children: string) => `<div>${children} </div>`;

// Function to convert HTML to Frames and Components
export const convertToFramesAndComponents = (
  html: string
): { frames: Frame[]; components: Component[] } => {
  const parsedHtml = html.trim();
  const parser = new DOMParser();
  const doc = parser.parseFromString(parsedHtml, "text/html");

  let idCounter = 0; // To generate unique IDs for each frame
  const frames: Frame[] = []; // To store the Frame instances
  const components: Component[] = []; // To store the Component instances

  // Function to create a Component instance from an HTML element
  const createComponent = (element: HTMLElement): Component => {
    const tag = element.tagName.toLowerCase();
    const attrs = Array.from(element.attributes).reduce<Record<string, string>>(
      (acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      },
      {}
    );
    // if the element has no children, and has text, then it is a text component
    const text =
      element.childNodes.length === 1 &&
      element.textContent?.trim() &&
      element.childNodes[0].nodeType === Node.TEXT_NODE
        ? element.textContent.trim()
        : null;

    return new Component(idCounter, {
      tag,
      attrs,
      text,
    });
  };

  // Recursive function to traverse the DOM and generate Frames and Components
  const traverseNode = (
    node: Node,
    parentId: number | null,
    position: number
  ) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const currentId = idCounter++;

      // Create a Component instance for the current element
      const component = createComponent(element);
      components.push(component);

      // Create a Frame instance
      const frame = new Frame(currentId, component.id, position, parentId);
      frames.push(frame);

      // Process child nodes
      Array.from(element.childNodes).forEach((child, index) => {
        traverseNode(child, currentId, index);
      });
    }
  };

  // Start traversal from the root
  traverseNode(doc.documentElement, null, 0);

  return { frames, components };
};

// Method to render HTML from frames and components
export function renderHtml(frames: Frame[], components: Component[]): string {
  // Create a map for quick lookup of components by id
  const componentMap = new Map<number, Component>();
  components.forEach((component) => componentMap.set(component.id, component));

  // Build a tree structure from frames
  const nodeMap = new Map<
    number,
    { frame: Frame; children: { [key: number]: any } }
  >();
  frames.forEach((frame) => {
    nodeMap.set(frame.id, { frame, children: {} });
  });

  // Populate the children in the tree
  frames.forEach((frame) => {
    if (frame.parentId !== null) {
      const parentNode = nodeMap.get(frame.parentId);
      if (parentNode) {
        parentNode.children[frame.position] = nodeMap.get(frame.id);
      }
    }
  });

  // Function to generate HTML from a node
  const generateHtml = (node: any): string => {
    if (!node) return "";

    const component = componentMap.get(node.frame.content_id);
    if (!component) return "";

    const tag = component.content.tag;
    const attrs = component.content.attrs
      ? Object.entries(component.content.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")
      : "";

    const textContent = component.content.text ? component.content.text : "";

    let attributes = [attrs].filter((attr) => attr).join(" ");

    // Open tag
    let html = `<${tag}${attributes ? " " + attributes : ""}>`;

    // Add text content
    html += textContent;

    // Add children
    const children = Object.values(node.children);
    if (children.length > 0) {
      html += children.map(generateHtml).join("");
    }

    // Close tag
    html += `</${tag}>`;

    return html;
  };

  // Find the root nodes (nodes with null parentId)
  const rootNodes = frames
    .filter((frame) => frame.parentId === null)
    .map((frame) => nodeMap.get(frame.id));

  // Generate HTML from the root nodes
  return rootNodes.map(generateHtml).join("");
}

// Stress test parameters
export const generateLargeHtml = (numElements: number): string => {
  let html = `<div class="container">`;
  for (let i = 0; i < numElements; i++) {
    html += `<div class="item">${i} <span>Nested Content</span></div>`;
  }
  html += `</div>`;
  return html;
};

// test deeply nested html
export const generateDeeplyNestedHtml = (depth: number): string => {
  let html = "";
  for (let i = 0; i < depth; i++) {
    html += `<div class="level-${i}">`;
  }
  html += "Deeply nested content";
  for (let i = 0; i < depth; i++) {
    html += `</div>`;
  }
  return html;
};

// cn
export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists));
