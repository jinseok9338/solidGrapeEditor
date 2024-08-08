import type { Editor } from "grapesjs";
import { Accessor, createContext, createSignal, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

const EditorInstanceContext = createContext<EditorInstanceState | null>(null);

export interface EditorInstanceState {
  editor: Accessor<Editor | null>;
  setEditor: (editor: Editor) => void;
}
export const EditorInstanceProvider = (props: { children?: JSX.Element }) => {
  const [editor, setEditor] = createSignal<Editor | null>(null);
  const handleSetEditor = (editor: Editor) => {
    setEditor(editor);
  };

  return (
    <EditorInstanceContext.Provider
      value={{
        editor,
        setEditor: handleSetEditor,
      }}
    >
      {props.children}
    </EditorInstanceContext.Provider>
  );
};

/**
 * Context used to keep the editor instance once initialized
 */
export const useEditorInstance = () => {
  const context = useContext(EditorInstanceContext);

  if (!context) {
    throw new Error(
      "useEditorInstance must be used within EditorInstanceProvider"
    );
  }

  return context;
};

/**
 * Get the current editor instance.
 * @returns Editor
 */
export const useEditor = (): Accessor<Editor | null> => {
  const { editor } = useEditorInstance();

  if (!editor()) {
    throw new Error(
      "useEditor used before the load of the editor instance. You can wrap your component in `<WithEditor>` or make use of `useEditorMaybe` hook and ensure the `editor` exists."
    );
  }

  return editor;
};

/**
 * Similar to useEditor, but in this case, the editor might be undefined.
 */
export const useEditorMaybe = () => {
  return useEditorInstance().editor;
};

export default EditorInstanceContext;
