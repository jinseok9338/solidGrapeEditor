import { cx } from "../common";
import TopbarButtons from "./TopBarButton";
import DevicesProvider from "@/dependency/DevicesProvider";
import WithEditor from "@/dependency/WithEditor";
import { JSX } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Topbar(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class={cx("gjs-top-sidebar flex items-center p-1", props.class)}>
      <DevicesProvider>
        {({ selected, select, devices }) => (
          <form>
            <Select
              value={selected}
              onChange={(v) => select(v)}
              placeholder="Select an option"
              options={devices.map((option) => ({
                value: option.id,
                rawValue: option.getName(),
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
        )}
      </DevicesProvider>
      <WithEditor>
        <TopbarButtons class="ml-auto px-2" />
      </WithEditor>
    </div>
  );
}
