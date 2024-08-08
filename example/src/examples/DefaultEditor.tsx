import { EditorProps } from "@/dependency/EditorInstance";
import { defaultEditorProps } from "./common";
import Editor from "../dependency/Editor";

export default function DefaultEditor(props: Partial<EditorProps>) {
  return (
    <Editor
      class="gjs-default-editor"
      {...defaultEditorProps}
      {...props}
      //grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
    />
  );
}
