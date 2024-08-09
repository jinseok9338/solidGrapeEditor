import type { Block } from "grapesjs";
import { useEditorInstance } from "./context/EditorInstance";
import { useEditorOptions } from "./context/EditorOptions";
import { isFunction, noop } from "./utils";
import { PortalContainerResult, portalContainer } from "./utils/solid";
import { createEffect, JSX, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

export type BlocksState = {
  /**
   * Array of blocks.
   */
  blocks: Block[];

  /**
   * Enable drag for a block.
   */
  dragStart: (block: Block, ev?: Event) => void;

  /**
   * Disable drag.
   */
  dragStop: (cancel?: boolean) => void;

  /**
   * Default Block Manager container.
   */
  Container: PortalContainerResult;

  /**
   * Map of blocks by category.
   */
  mapCategoryBlocks: MapCategoryBlocks;
};

export type BlocksResultProps = BlocksState;

export interface BlocksProviderProps {
  children: (props: BlocksResultProps) => JSX.Element;
}

export interface BlocksEventProps {
  blocks: Block[];
  container: HTMLElement;
  dragStart: (block: Block, ev?: Event) => void;
  drag: (ev: Event) => void;
  dragStop: (cancel?: boolean) => void;
}

export type MapCategoryBlocks = Map<string, Block[]>;

const BlocksProvider = (props: BlocksProviderProps) => {
  const { editor } = useEditorInstance();
  const options = useEditorOptions();
  const [propState, setPropState] = createStore<BlocksState>({
    blocks: [],
    dragStart: noop,
    dragStop: noop,
    mapCategoryBlocks: new Map(),
    Container: () => null,
  });

  createEffect(() => {
    if (!editor()) return;
    const event = editor()?.Blocks.events.custom;

    const toListen = ({
      blocks,
      container,
      dragStart,
      dragStop,
    }: BlocksEventProps) => {
      const mapCategoryBlocks = blocks.reduce((res, block) => {
        const categoryLabel = block.getCategoryLabel();
        const categoryBlocks = res.get(categoryLabel);

        if (!categoryBlocks) {
          res.set(categoryLabel, [block]);
        } else {
          categoryBlocks.push(block);
        }

        return res;
      }, new Map() as MapCategoryBlocks);

      setPropState({
        blocks,
        dragStart,
        dragStop,
        mapCategoryBlocks,
        Container: portalContainer(container),
      });
    };
    if (event) {
      editor()?.on(event, toListen);
    }

    editor()?.Blocks.__trgCustom();

    onCleanup(() => {
      if (event) {
        editor()?.off(event, toListen);
      }
    });
  }, [editor]);

  onMount(() => options.setCustomBlocks(true));

  return editor()
    ? isFunction(props.children)
      ? props.children(propState)
      : null
    : null;
};

export default BlocksProvider;
