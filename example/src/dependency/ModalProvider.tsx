//import React, { createElement, memo, useEffect, useState } from "react";
import { JSX } from "solid-js/jsx-runtime";
import { useEditorInstance } from "./context/EditorInstance";
import { useEditorOptions } from "./context/EditorOptions";
import { noop } from "./utils";
import { WrapDom } from "./utils/solid";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

export interface ModalState {
  /**
   * Modal title
   */
  title: JSX.Element;

  /**
   * Modal content
   */
  content: JSX.Element;

  /**
   * Modal attributes
   */
  attributes: Record<string, any>;

  /**
   * Callback for closing the modal
   */
  close: () => void;
}

export interface ModalResultProps extends ModalState {
  /**
   * Indicates if the modal is open.
   */
  open: boolean;
}

export interface ModalProviderProps {
  children: (props: ModalResultProps) => JSX.Element;
}

export interface ModalEventProps {
  open: boolean;
  title: string | HTMLElement;
  content: string | HTMLElement;
  attributes: Record<string, any>;
  close: () => void;
}

const ModalProvider = (props: ModalProviderProps) => {
  const { editor } = useEditorInstance();
  const options = useEditorOptions();
  const [isOpen, setOpen] = createSignal(false);
  const [modalState, setModalState] = createStore<ModalState>({
    title: <></>,
    content: <></>,
    attributes: {},
    close: noop,
  });

  createEffect(() => {
    if (!editor()) return;
    const event = "modal";

    const toListen = ({
      open,
      title,
      content,
      close,
      attributes,
    }: ModalEventProps) => {
      const WrapTitle = WrapDom(title);
      const WrapContent = WrapDom(content);
      open &&
        setModalState({
          title: <WrapTitle />,
          content: <WrapContent />,
          attributes,
          close,
        });
      setOpen(open);
    };

    editor()?.on(event, toListen);

    onCleanup(() => {
      editor()?.off(event, toListen);
    });
  });

  onMount(() => options.setCustomModal(true));

  return editor()
    ? typeof props.children === "function"
      ? props.children({ open: isOpen(), ...modalState })
      : null
    : null;
};

export default ModalProvider;
