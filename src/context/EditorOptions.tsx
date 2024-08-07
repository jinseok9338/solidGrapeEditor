import { createContext, createSignal, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";

const EditorOptionsContext = createContext<
  (EditorOptionsState & EditorOptions) | null
>(null);

export interface EditorOptionsState {
  setRefCanvas: (ref: HTMLElement) => void;
  setCustomModal: (value: boolean) => void;
  setCustomAssets: (value: boolean) => void;
  setCustomBlocks: (value: boolean) => void;
  setCustomRte: (value: boolean) => void;
  setCustomStyles: (value: boolean) => void;
  setCustomLayers: (value: boolean) => void;
  setCustomSelectors: (value: boolean) => void;
  setCustomTraits: (value: boolean) => void;
  setReady: (value: boolean) => void;
}

export interface EditorOptions {
  refCanvas?: HTMLElement;
  customModal?: boolean;
  customAssets?: boolean;
  customStyles?: boolean;
  customBlocks?: boolean;
  customLayers?: boolean;
  customSelectors?: boolean;
  customTraits?: boolean;
  customRte?: boolean;
  ready?: boolean;
}

export const EditorOptionsProvider = ({
  children,
}: {
  children?: JSX.Element;
}) => {
  const [state, setState] = createStore<EditorOptions>({
    refCanvas: undefined,
    customModal: false,
    customAssets: false,
    customStyles: false,
    customBlocks: false,
    customLayers: false,
    customSelectors: false,
    customTraits: false,
    customRte: false,
    ready: false,
  });

  const handleSetRefCanvas = (refCanvas: HTMLElement) => {
    setState("refCanvas", refCanvas);
  };

  const handleSetCustomModal = (customModal: boolean) => {
    setState("customModal", customModal);
  };

  const handleSetCustomAssets = (customAssets: boolean) => {
    setState("customAssets", customAssets);
  };

  const handleSetCustomBlocks = (customBlocks: boolean) => {
    setState("customBlocks", customBlocks);
  };

  const handleSetCustomRte = (customRte: boolean) => {
    setState("customRte", customRte);
  };

  const handleSetCustomStyles = (customStyles: boolean) => {
    setState("customStyles", customStyles);
  };

  const handleSetCustomLayers = (customLayers: boolean) => {
    setState("customLayers", customLayers);
  };

  const handleSetCustomSelectors = (customSelectors: boolean) => {
    setState("customSelectors", customSelectors);
  };

  const handleSetCustomTraits = (customTraits: boolean) => {
    setState("customTraits", customTraits);
  };

  const handleSetReady = (ready: boolean) => {
    setState("ready", ready);
  };

  return (
    <EditorOptionsContext.Provider
      value={{
        ...state,
        setRefCanvas: handleSetRefCanvas,
        setCustomModal: handleSetCustomModal,
        setCustomAssets: handleSetCustomAssets,
        setCustomBlocks: handleSetCustomBlocks,
        setCustomRte: handleSetCustomRte,
        setCustomStyles: handleSetCustomStyles,
        setCustomLayers: handleSetCustomLayers,
        setCustomSelectors: handleSetCustomSelectors,
        setCustomTraits: handleSetCustomTraits,
        setReady: handleSetReady,
      }}
    >
      {children}
    </EditorOptionsContext.Provider>
  );
};

/**
 * Context used to keep the editor instance once initialized
 */
export const useEditorOptions = () => {
  const context = useContext(EditorOptionsContext);

  if (!context) {
    throw new Error(
      "useEditorOptions must be used within EditorOptionsProvider"
    );
  }

  return context;
};

export default EditorOptionsContext;
