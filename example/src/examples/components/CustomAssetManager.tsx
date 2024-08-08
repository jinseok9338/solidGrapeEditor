import type { Asset } from "grapesjs";
import { BTN_CLS } from "../common";
import { For } from "solid-js";
import { AiOutlineCloseCircle } from "solid-icons/ai";
import { AssetsResultProps } from "@/dependency/AssetsProvider";
import { useEditor } from "@/dependency/context/EditorInstance";

export type CustomAssetManagerProps = Pick<
  AssetsResultProps,
  "assets" | "close" | "select"
>;

export default function CustomAssetManager({
  assets,
  select,
}: CustomAssetManagerProps) {
  // useEditor 를 쓰면 eidtor 는 존재함
  const editor = useEditor();

  const remove = (asset: Asset) => {
    editor()?.Assets.remove(asset);
  };

  return (
    <div class="grid grid-cols-3 gap-2 pr-2">
      <For each={assets}>
        {(asset) => (
          <div class="relative group rounded overflow-hidden">
            <img class="display-block" src={asset.getSrc()} />
            <div class="flex flex-col items-center justify-end absolute top-0 left-0 w-full h-full p-5 bg-zinc-700/75 group-hover:opacity-100 opacity-0 transition-opacity">
              <button
                type="button"
                class={BTN_CLS}
                onClick={() => select(asset, true)}
              >
                Select
              </button>
              <button
                type="button"
                class="absolute top-2 right-2"
                onClick={() => remove(asset)}
              >
                <AiOutlineCloseCircle size={2} />
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
