import { cn } from "@/libs/cn";
import { JSX, Component } from "solid-js";

// Define the props type for the IconButton component
interface IconButtonProps {
  children: JSX.Element; // The icon or any other element to be rendered inside the button
  onClick: () => void; // Function to be called when the button is clicked
  size?: "small" | "medium" | "large"; // Optional size prop with predefined options
  class?: string; // Optional class prop to add custom styles
}

// Solid.js IconButton component
const IconButton: Component<IconButtonProps> = (props) => {
  // Define size classes based on the size prop
  const sizeClasses = () => {
    switch (props.size) {
      case "small":
        return "p-1 text-sm";
      case "large":
        return "p-3 text-lg";
      case "medium":
      default:
        return "p-2 text-base";
    }
  };

  return (
    <button
      type="button"
      class={cn(
        `rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none ${sizeClasses()}`,
        props.class
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
