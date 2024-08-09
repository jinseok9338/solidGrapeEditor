import { For } from "solid-js";

import { BTN_CLS, MAIN_BORDER_COLOR, cx } from "../common";
import { AiFillDelete } from "solid-icons/ai";
import { PagesResultProps } from "@/dependency/PagesProvider";

export default function CustomPageManager(props: PagesResultProps) {
  const addNewPage = () => {
    const nextIndex = props.pages.length + 1;
    props.add({
      name: `New page ${nextIndex}`,
      component: `<h1>Page content ${nextIndex}</h1>`,
    });
  };

  return (
    <div class="gjs-custom-page-manager">
      <div class="p-2">
        <button type="button" class={BTN_CLS} onClick={addNewPage}>
          Add new page
        </button>
      </div>
      <For each={props.pages}>
        {(page, index) => (
          <div
            class={cx(
              "flex items-center py-2 px-4 border-b",
              index() === 0 && "border-t",
              MAIN_BORDER_COLOR
            )}
          >
            <button
              type="button"
              class="flex-grow text-left"
              onClick={() => props.select(page)}
            >
              {page.getName() || "Untitled page"}
            </button>
            {props.selected !== page && (
              <button type="button" onClick={() => props.remove(page)}>
                <AiFillDelete size={0.7} />
              </button>
            )}
          </div>
        )}
      </For>
    </div>
  );
}
