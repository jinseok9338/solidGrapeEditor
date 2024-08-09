import type { Trait } from "grapesjs";
import { cx } from "../common";
import { JSX, splitProps } from "solid-js";
import { TextField } from "@/components/ui/textfield";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/dependency/context/EditorInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StylePropertyFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
  trait: Trait;
}

export default function TraitPropertyField(props: StylePropertyFieldProps) {
  const [local, rest] = splitProps(props, ["trait"]);
  const editor = useEditor();
  const handleChange = (value: string) => {
    local.trait.setValue(value);
  };

  const onChange = (ev: any) => {
    handleChange(ev.target.value);
  };

  const handleButtonClick = () => {
    const command = local.trait.get("command");
    if (command) {
      typeof command === "string"
        ? editor()?.runCommand(command)
        : command(editor()!, local.trait);
    }
  };

  const type = local.trait.getType();
  const defValue =
    local.trait.getDefault() || local.trait.attributes.placeholder;
  const value = local.trait.getValue();
  const valueWithDef = typeof value !== "undefined" ? value : defValue;
  console.log("value", value);

  const inputToRender = () => {
    switch (type) {
      case "select":
        return (
          <form>
            <Select
              value={value}
              onChange={onChange}
              placeholder="Select an option"
              options={local.trait.getOptions().map((option) => ({
                value: local.trait.getOptionId(option),
                rawValue: local.trait.getOptionLabel(option),
              }))}
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger>
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </form>
        );

        break;
      case "color":
        return (
          <TextField
            placeholder={defValue}
            value={value}
            onChange={onChange}
            size="small"
          />
        );

      case "checkbox":
        return (
          <Checkbox checked={value} onChange={(v) => local.trait.setValue(v)} />
        );

      case "button":
        return (
          <Button onClick={handleButtonClick}>{local.trait.getLabel()}</Button>
        );

      default:
        return (
          <TextField
            placeholder={defValue}
            value={value}
            onChange={onChange}
            size="small"
          />
        );
    }
  };

  return (
    <div {...rest} class={cx("mb-3 px-1 w-full")}>
      <div class={cx("flex mb-2 items-center")}>
        <div class="flex-grow capitalize">{local.trait.getLabel()}</div>
      </div>
      {inputToRender()}
    </div>
  );
}
