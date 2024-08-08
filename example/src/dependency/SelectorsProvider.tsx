import type { Selector, State, Editor } from "grapesjs";
import { useEditorInstance } from "./context/EditorInstance";
import { isFunction, noop } from "./utils";
import { PortalContainerResult, portalContainer } from "./utils/solid";
import { useEditorOptions } from "./context/EditorOptions";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { createEffect, onCleanup, onMount } from "solid-js";

export type SelectorsState = {
  /**
   * Array of current selectors.
   */
  selectors: Selector[];

  /**
   * Array of available states.
   */
  states: State[];

  /**
   * Current selected state.
   */
  selectedState: string;

  /**
   * Selector strings of currently selected targets.
   */
  targets: string[];

  /**
   * Add new selector to selected targets.
   */
  addSelector: (
    ...args: Parameters<Editor["Selectors"]["addSelected"]>
  ) => void;

  /**
   * Remove selector from selected targets.
   */
  removeSelector: (
    ...args: Parameters<Editor["Selectors"]["removeSelected"]>
  ) => void;

  /**
   * Update current state.
   */
  setState: (...args: Parameters<Editor["Selectors"]["setState"]>) => void;

  /**
   * Default Selectors container.
   */
  Container: PortalContainerResult;
};

export type SelectorsResultProps = SelectorsState;

export interface SelectorsProviderProps {
  children: (props: SelectorsResultProps) => JSX.Element;
}

const SelectorsProvider = (props: SelectorsProviderProps) => {
  const { editor } = useEditorInstance();
  const options = useEditorOptions();
  const [propState, setPropState] = createStore<SelectorsState>({
    selectors: [],
    states: [],
    selectedState: "",
    targets: [],
    addSelector: noop,
    removeSelector: noop,
    setState: noop,
    Container: () => null,
  });

  createEffect(() => {
    if (!editor()) return;

    const event = editor()?.Selectors.events.custom;

    const up = ({ container }: { container: HTMLElement }) => {
      setPropState({
        selectors: editor()?.Selectors.getSelected(),
        states: editor()?.Selectors.getStates(),
        selectedState: editor()?.Selectors.getState(),
        targets: editor()
          ?.Selectors.getSelectedTargets()
          .map((t) => t.getSelectorsString()),
        addSelector: (...args) => editor()?.Selectors.addSelected(...args),
        removeSelector: (...args) =>
          editor()?.Selectors.removeSelected(...args),
        setState: (...args) => editor()?.Selectors.setState(...args),
        Container: portalContainer(container),
      });
    };
    if (event) {
      editor()?.on(event, up);
    }

    onCleanup(() => {
      if (event) {
        editor()?.off(event, up);
      }
    });
  });

  onMount(() => options.setCustomSelectors(true));
  return editor()
    ? isFunction(props.children)
      ? props.children(propState)
      : null
    : null;
};

export default SelectorsProvider;
