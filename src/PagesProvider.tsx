import type { Editor, Page } from "grapesjs";
//import React, { memo, useEffect, useState } from 'react';
import { useEditorInstance } from "./context/EditorInstance";
import { isFunction, noop } from "./utils";
import { JSX } from "solid-js/jsx-runtime";
import { createEffect, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

export type PagesState = {
  /**
   * Array of pages.
   */
  pages: Page[];

  /**
   * Selected page.
   */
  selected?: Page;

  /**
   * Select page.
   */
  select: Editor["Pages"]["select"];

  /**
   * Add new page.
   */
  add: Editor["Pages"]["add"];

  /**
   * Remove page.
   */
  remove: Editor["Pages"]["remove"];
};

export type PagesResultProps = PagesState;

export interface PagesProviderProps {
  children: (props: PagesResultProps) => JSX.Element;
}

const PagesProvider = ({ children }: PagesProviderProps) => {
  const { editor } = useEditorInstance();
  const [propState, setPropState] = createStore<PagesState>({
    pages: [],
    selected: undefined,
    select: noop as any,
    add: noop as any,
    remove: noop as any,
  });

  createEffect(() => {
    if (!editor()) return;

    const event = editor()?.Pages.events.all;

    const up = () => {
      setPropState({
        pages: editor()?.Pages.getAll(),
        selected: editor()?.Pages.getSelected(),
        select: (...args) => editor()?.Pages.select(...args) as any,
        add: (...args) => editor()?.Pages.add(...args),
        remove: (...args) => editor()?.Pages.remove(...args),
      });
    };

    if (event) {
      editor()?.on(event, up);
    }

    up();

    onCleanup(() => {
      if (event) {
        editor()?.off(event, up);
      }
    });
  });

  return editor() ? (isFunction(children) ? children(propState) : null) : null;
};

export default PagesProvider;
