import { AiOutlineArrowDown } from "solid-icons/ai";
import { AiOutlineArrowUp } from "solid-icons/ai";
import { AiFillCloseCircle } from "solid-icons/ai";
import { AiFillDelete } from "solid-icons/ai";
import { AiFillPlusCircle } from "solid-icons/ai";
import type {
  Property,
  PropertyComposite,
  PropertyRadio,
  PropertySelect,
  PropertySlider,
  PropertyStack,
} from "grapesjs";
import { BTN_CLS, ROUND_BORDER_COLOR, cx } from "../common";
import {
  useEditor,
  useEditorInstance,
} from "@/dependency/context/EditorInstance";
import { createMemo, For, JSX, Show, splitProps } from "solid-js";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";
import { RadioGroup } from "@kobalte/core/radio-group";
import SliderComponent from "./Slider";
import IconButton from "./IconButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "@/components/ui/radio-group";

interface StylePropertyFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
  prop: Property;
}

export default function StylePropertyField(props: StylePropertyFieldProps) {
  const [local, rest] = splitProps(props, ["prop"]);

  const { editor } = useEditorInstance();
  const handleChange = (value: string) => {
    local.prop.upValue(value);
  };

  const onChange = (value: string) => {
    handleChange(value);
  };

  const openAssets = () => {
    editor()?.Assets.open({
      select: (asset, complete) => {
        console.log({ complete });
        local.prop.upValue(asset.getSrc(), { partial: !complete });
        complete && editor()?.Assets.close();
      },
      types: ["image"],
      accept: "image/*",
    });
  };

  const type = createMemo(() => local.prop.getType());
  const defValue = createMemo(() => local.prop.getDefaultValue());
  const canClear = createMemo(() => local.prop.canClear());
  const value = createMemo(() => local.prop.getValue());

  const inputToRender = () => {
    switch (type()) {
      case "radio": {
        const radioProp = createMemo(() => local.prop as PropertyRadio);

        return (
          <RadioGroup value={value()} class="grid gap-2" onChange={onChange}>
            <For each={radioProp().getOptions()}>
              {(option) => (
                <RadioGroupItem
                  value={radioProp().getOptionId(option)}
                  class="flex items-center gap-2"
                >
                  <RadioGroupItemControl />
                  <RadioGroupItemLabel class="text-sm">
                    {radioProp().getOptionLabel(option)}
                  </RadioGroupItemLabel>
                </RadioGroupItem>
              )}
            </For>
          </RadioGroup>
        );
      }

      case "select": {
        const selectProp = local.prop as PropertySelect;
        return (
          <form class="flex items-center gap-2 h-fit">
            <Select
              value={value()}
              onChange={(v) => {
                const option = selectProp
                  .getOptions()
                  .find((option) => selectProp.getOptionLabel(option) === v);
                if (option) {
                  onChange(selectProp.getOptionId(option));
                }
              }}
              placeholder="Select an option"
              options={selectProp
                .getOptions()
                .map((option) => selectProp.getOptionLabel(option))}
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
      }

      case "color": {
        return (
          <TextFieldRoot>
            <TextField
              placeholder={defValue()}
              value={value() ?? ""}
              onChange={(e: any) => onChange(e.target.value)}
              size="small"
            />
          </TextFieldRoot>
        );
      }

      case "slider": {
        const sliderProp = local.prop as PropertySlider;
        return (
          <SliderComponent
            value={parseFloat(value())}
            min={sliderProp.getMin()}
            max={sliderProp.getMax()}
            step={sliderProp.getStep()}
            onChange={(v) => onChange(v.toString())}
          />
        );
      }
      case "file": {
        return (
          <div class="flex flex-col items-center gap-3">
            {value && value() !== defValue && (
              <div
                class="w-[50px] h-[50px] rounded inline-block bg-cover bg-center cursor-pointer"
                style={{ "background-image": `url("${value}")` }}
                onClick={() => handleChange("")}
              />
            )}
            <button type="button" onClick={openAssets} class={BTN_CLS}>
              Select Image
            </button>
          </div>
        );
      }

      case "composite": {
        const compositeProp = local.prop as PropertyComposite;
        return (
          <div class={cx("flex flex-wrap p-2 bg-black/20", ROUND_BORDER_COLOR)}>
            {compositeProp.getProperties().map((prop) => (
              <StylePropertyField prop={prop} />
            ))}
          </div>
        );
      }

      case "stack": {
        const stackProp = local.prop as PropertyStack;

        return (
          <div
            class={cx(
              "flex flex-col p-2 gap-2 bg-black/20 min-h-[54px]",
              ROUND_BORDER_COLOR
            )}
          >
            {stackProp.getLayers().map((layer) => (
              <div class={ROUND_BORDER_COLOR}>
                <div class="flex gap-1 bg-slate-800 px-2 py-1 items-center">
                  <IconButton
                    size="small"
                    onClick={() => layer.move(layer.getIndex() - 1)}
                  >
                    {/* <Icon size={0.7} path={mdiArrowUpDropCircle} /> */}
                    <AiOutlineArrowUp size={20} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => layer.move(layer.getIndex() + 1)}
                  >
                    {/* <Icon size={0.7} path={mdiArrowDownDropCircle} /> */}
                    <AiOutlineArrowDown size={20} />
                  </IconButton>
                  <button class="flex-grow" onClick={() => layer.select()}>
                    {layer.getLabel()}
                  </button>
                  <div
                    class={cx(
                      "bg-white min-w-[17px] min-h-[17px] text-black text-sm flex justify-center",
                      ROUND_BORDER_COLOR
                    )}
                    style={layer.getStylePreview({
                      number: { min: -3, max: 3 },
                      camelCase: true,
                    })}
                  >
                    {stackProp.getName() === "text-shadow" && "T"}
                  </div>
                  <IconButton size="small" onClick={() => layer.remove()}>
                    {/* <Icon size={0.7} path={mdiDelete} /> */}
                    <AiFillDelete size={20} />
                  </IconButton>
                </div>
                {layer.isSelected() && (
                  <div class="p-2 flex flex-wrap">
                    {stackProp.getProperties().map((prop) => (
                      <StylePropertyField prop={prop} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      default:
        return (
          <TextFieldRoot>
            <TextField
              placeholder={defValue()}
              value={value() ?? ""}
              onChange={(e: any) => onChange(e.target.value)}
              size="small"
            />
          </TextFieldRoot>
        );
    }
  };

  return (
    <div
      {...rest}
      class={cx("mb-3 px-1", local.prop.isFull() ? "w-full" : "w-1/2")}
    >
      <div class={cx("flex mb-2 items-center", canClear() && "text-sky-300")}>
        <div class="flex-grow capitalize">{local.prop.getLabel()}</div>
        <Show when={canClear}>
          <button onClick={() => local.prop.clear()}>
            <AiFillCloseCircle size={20} />
          </button>
        </Show>
        <Show when={type() === "stack"}>
          <IconButton
            size="small"
            class="!ml-2"
            onClick={() =>
              (local.prop as PropertyStack).addLayer({}, { at: 0 })
            }
          >
            <AiFillPlusCircle size={20} />
          </IconButton>
        </Show>
      </div>
      {inputToRender()}
    </div>
  );
}
