import type { Asset } from "grapesjs";
import { useEditorInstance } from "./context/EditorInstance";
import { useEditorOptions } from "./context/EditorOptions";
import { isFunction } from "./utils";
import { PortalContainerResult, portalContainer } from "./utils/solid";
import { JSX } from "solid-js/jsx-runtime";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

export type AssetsState = {
  /**
   * Array of assets.
   */
  assets: Asset[];

  /**
   * Asset types.
   */
  types: string[];

  /**
   * Select asset.
   */
  select: (asset: Asset, complete?: boolean) => void;

  /**
   * Close assets.
   */
  close: () => void;

  /**
   * Asset Manager container.
   */
  Container: PortalContainerResult;
};

export type AssetsResultProps = AssetsState & {
  /**
   * Indicates if the Asset Manager is open.
   */
  open: boolean;
};

export interface AssetsProviderProps {
  children: (props: AssetsResultProps) => JSX.Element;
}

export interface AssetsEventProps {
  open: boolean;
  assets: Asset[];
  types: string[];
  select: () => void;
  close: () => void;
  container: HTMLElement;
}

const AssetsProvider = ({ children }: AssetsProviderProps) => {
  const { editor } = useEditorInstance();
  const options = useEditorOptions();
  const [open, setOpen] = createSignal(false);
  const [propState, setPropState] = createStore<AssetsState>({
    assets: [],
    types: [],
    close: () => {},
    select: () => {},
    Container: () => null,
  });

  createEffect(() => {
    if (!editor()) return;
    const event = editor()?.Assets.events.custom;

    const toListen = ({
      open,
      assets,
      types,
      select,
      close,
      container,
    }: AssetsEventProps) => {
      open &&
        setPropState({
          assets,
          types,
          select,
          close,
          Container: portalContainer(container),
        });
      setOpen(open);
    };
    if (event) {
      editor()?.on(event, toListen);
    }

    onCleanup(() => {
      if (event) {
        editor()?.off(event, toListen);
      }
    });
  });

  onMount(() => options.setCustomAssets(true));

  return editor()
    ? isFunction(children)
      ? children({ open: open(), ...propState })
      : null
    : null;
};

export default AssetsProvider;
