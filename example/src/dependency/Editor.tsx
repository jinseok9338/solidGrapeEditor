import { splitProps } from "solid-js";
import { EditorInstanceProvider } from "./context/EditorInstance";
import { EditorOptionsProvider } from "./context/EditorOptions";
import EditorInstance, { EditorProps } from "./EditorInstance";
import EditorReady from "./EditorReady";

const Editor = (props: EditorProps) => {
  const [local, rest] = splitProps(props, ["children"]);
  return (
    <EditorInstanceProvider>
      <EditorOptionsProvider>
        <EditorInstance {...rest}>
          {local.children}
          <EditorReady></EditorReady>
        </EditorInstance>
      </EditorOptionsProvider>
    </EditorInstanceProvider>
  );
};

export default Editor;
