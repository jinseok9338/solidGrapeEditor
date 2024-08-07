import type { Component } from "grapesjs";
//import React, { memo, useEffect, useState } from "react";
import { useEditorInstance } from "./context/EditorInstance";
import { useEditorOptions } from "./context/EditorOptions";
import { isFunction } from "./utils";
import { PortalContainerResult, portalContainer } from "./utils/solid";
import { JSX } from "solid-js/jsx-runtime";
import { createEffect, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { create } from "domain";

export type LayersState = {
  /**
   * Root layer component.
   */
  root?: Component;

  /**
   * Default Layers Manager container.
   */
  Container: PortalContainerResult;
};

export type LayersResultProps = LayersState;

export interface LayersProviderProps {
  children: (props: LayersResultProps) => JSX.Element;
}

const LayersProvider = ({ children }: LayersProviderProps) => {
  const { editor } = useEditorInstance();
  const options = useEditorOptions();
  const [propState, setPropState] = createStore<LayersState>({
    root: undefined,
    Container: () => null,
  });

  createEffect(() => {
    if (!editor()) return;

    const event = editor()?.Layers.events.custom;

    const up = ({ container }: { container: HTMLElement }) => {
      setPropState({
        root: editor()?.Layers.getRoot(),
        Container: portalContainer(container),
      });
    };
    if (event) {
      editor()?.on(event, up);
    }

    editor()?.Layers.__trgCustom({});

    onCleanup(() => {
      if (event) {
        editor()?.off(event, up);
      }
    });
  }, [editor]);

  onMount(() => options.setCustomLayers(true));

  return editor() ? (isFunction(children) ? children(propState) : null) : null;
};

export default LayersProvider;
