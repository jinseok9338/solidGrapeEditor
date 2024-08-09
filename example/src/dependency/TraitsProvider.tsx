import type { Trait } from "grapesjs";
//import React, { memo, useEffect, useState } from 'react';
import { useEditor, useEditorInstance } from "./context/EditorInstance";
import { useEditorOptions } from "./context/EditorOptions";
import { isFunction } from "./utils";
import { PortalContainerResult, portalContainer } from "./utils/solid";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { createEffect, onCleanup, onMount } from "solid-js";

export type TraitsState = {
  /**
   * Current selected traits.
   */
  traits: Trait[];

  /**
   * Default Trait Manager container.
   */
  Container: PortalContainerResult;
};

export type TraitsResultProps = TraitsState;

export interface TraitsProviderProps {
  children: (props: TraitsResultProps) => JSX.Element;
}

const TraitsProvider = (props: TraitsProviderProps) => {
  const editor = useEditor();
  const options = useEditorOptions();
  const [propState, setPropState] = createStore<TraitsState>({
    traits: [],
    Container: () => null,
  });

  createEffect(() => {
    if (!editor()) return;

    const event = editor()?.Traits.events.custom;

    const up = ({ container }: { container: HTMLElement }) => {
      setPropState({
        traits: editor()?.Traits.getCurrent(),
        Container: portalContainer(container),
      });
    };

    if (event) {
      editor()?.on(event, up);
    }
    editor()?.Traits.__trgCustom();

    onCleanup(() => {
      if (event) {
        editor()?.off(event, up);
      }
    });
  });

  onMount(() => options.setCustomTraits(true));

  return editor()
    ? isFunction(props.children)
      ? props.children(propState)
      : null
    : null;
};

export default TraitsProvider;
