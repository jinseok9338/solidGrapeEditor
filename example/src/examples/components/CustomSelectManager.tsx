import { AiFillCloseCircle } from "solid-icons/ai";
import { AiFillPlusCircle } from "solid-icons/ai";
import { MAIN_BORDER_COLOR, cx } from "../common";

import { For } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectorsResultProps } from "@/dependency/SelectorsProvider";

export default function CustomSelectorManager({
  selectors,
  selectedState,
  states,
  targets,
  setState,
  addSelector,
  removeSelector,
}: Omit<SelectorsResultProps, "Container">) {
  const addNewSelector = () => {
    const next = selectors.length + 1;
    addSelector({ name: `new-${next}`, label: `New ${next}` });
  };

  const targetStr = targets.join(", ");

  return (
    <div class="gjs-custom-selector-manager p-2 flex flex-col gap-2 text-left">
      <div class="flex items-center">
        <div class="flex-grow">Selectors</div>
        <form class="flex items-center gap-2">
          <Select
            value={selectedState}
            onChange={(v) => setState(v)}
            options={states.map((state) => ({
              value: state.id,
              rawValue: state.getName(),
            }))}
            placeholder="- State -"
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
      </div>
      <div
        class={cx(
          "flex items-center gap-2 flex-wrap p-2 bg-black/30 border rounded min-h-[45px]",
          MAIN_BORDER_COLOR
        )}
      >
        {targetStr ? (
          <button
            type="button"
            onClick={addNewSelector}
            class={cx("border rounded px-2 py-1")}
          >
            <AiFillPlusCircle size={0.7} />
          </button>
        ) : (
          <div class="opacity-70">Select a component</div>
        )}
        <For each={selectors}>
          {(selector) => (
            <div class="px-2 py-1 flex items-center gap-1 whitespace-nowrap bg-sky-500 rounded">
              <div>{selector.getLabel()}</div>
              <button type="button" onClick={() => removeSelector(selector)}>
                <AiFillCloseCircle size={0.7} />
              </button>
            </div>
          )}
        </For>
      </div>
      <div>
        Selected: <span class="opacity-70">{targetStr || "None"}</span>
      </div>
    </div>
  );
}
