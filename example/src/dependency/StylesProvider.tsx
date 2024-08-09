import type { Sector } from "grapesjs";
//import React, { memo, useEffect, useState } from 'react';
import { useEditorInstance } from "./context/EditorInstance";
import { isFunction } from "./utils";
import { PortalContainerResult, portalContainer } from "./utils/solid";
import { useEditorOptions } from "./context/EditorOptions";
import { createStore } from "solid-js/store";
import { JSX } from "solid-js/jsx-runtime";
import { createEffect, createMemo, onCleanup, onMount } from "solid-js";

export type StylesState = {
  /**
   * Array of visible sectors.
   */
  sectors: Sector[];

  /**
   * Default Styles container.
   */
  Container: PortalContainerResult;
};

export type StylesResultProps = StylesState;

export interface StylesProviderProps {
  children: (props: StylesResultProps) => JSX.Element;
}

const StylesProvider = (props: StylesProviderProps) => {
  const { editor } = useEditorInstance();
  const options = useEditorOptions();
  const [propState, setPropState] = createStore<StylesState>({
    sectors: [],
    Container: () => null,
  });

  createEffect(() => {
    if (!editor()) return;

    const event = createMemo(() => editor()?.Styles.events.custom);

    const up = ({ container }: { container: HTMLElement }) => {
      setPropState({
        sectors: editor()?.Styles.getSectors({ visible: true }),
        Container: portalContainer(container),
      });
    };

    if (event()) {
      editor()?.on(event() ?? "", up);
    }

    onCleanup(() => {
      if (event()) {
        editor()?.off(event() ?? "", up);
      }
    });
  });

  onMount(() => options.setCustomStyles(true));
  return editor()
    ? isFunction(props.children)
      ? props.children(propState)
      : null
    : null;
};

export default StylesProvider;
