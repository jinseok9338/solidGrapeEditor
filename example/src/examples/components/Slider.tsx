import { createSignal } from "solid-js";

function SliderComponent(props: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  // Initialize the signal for the slider value
  const [value, setValue] = createSignal(props.value || 0);

  // Handle the slider value change
  const handleChange = (event: { target: { value: string } }) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  };

  return (
    <div class="flex items-center space-x-3 w-full">
      <input
        type="range"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        min={props.min}
        max={props.max}
        step={props.step}
        value={value()}
        onInput={handleChange} // onInput event for real-time updates
      />
      <div class="ml-2 text-sm text-gray-600">{value()}</div>{" "}
      {/* Optional: display the value */}
    </div>
  );
}

export default SliderComponent;
