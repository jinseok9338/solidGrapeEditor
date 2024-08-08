import { For } from "solid-js";

import { MAIN_BORDER_COLOR, cx } from "../common";
import { BlocksResultProps } from "@/dependency/BlocksProvider";

export type CustomBlockManagerProps = Pick<
  BlocksResultProps,
  "mapCategoryBlocks" | "dragStart" | "dragStop"
>;

export default function CustomBlockManager({
  mapCategoryBlocks,
  dragStart,
  dragStop,
}: CustomBlockManagerProps) {
  return (
    <div class="gjs-custom-block-manager text-left">
      <For each={Array.from(mapCategoryBlocks)}>
        {([category, blocks]) => (
          <div>
            <div class={cx("py-2 px-4 border-y", MAIN_BORDER_COLOR)}>
              {category}
            </div>
            <div class="grid grid-cols-2 gap-2 p-2">
              <For each={blocks}>
                {(block) => (
                  <div
                    draggable
                    class={cx(
                      "flex flex-col items-center border rounded cursor-pointer py-2 px-5 transition-colors",
                      MAIN_BORDER_COLOR
                    )}
                    onDragStart={(ev) => dragStart(block, ev)}
                    onDragEnd={() => dragStop(false)}
                  >
                    <div class="h-10 w-10" innerHTML={block.getMedia()} />
                    <div
                      class="text-sm text-center w-full"
                      title={block.getLabel()}
                    >
                      {block.getLabel()}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
