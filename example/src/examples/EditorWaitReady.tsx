import { EditorProps } from "../dependency/EditorInstance";
import { defaultEditorProps, slowStoragePlugin } from "./common";
import FullSpinner from "./components/FullSpinner";
import Editor from "../dependency/Editor";

const options = {
  ...defaultEditorProps.options,
  storageManager: { type: "slow" },
};

const plugins = [slowStoragePlugin, ...defaultEditorProps.plugins!];

export default function EditorWaitReady(props: Partial<EditorProps>) {
  return (
    <Editor
      class="gjs-editor-wait-ready"
      {...defaultEditorProps}
      options={options}
      plugins={plugins}
      {...props}
      waitReady={<FullSpinner />}
    />
  );
}
