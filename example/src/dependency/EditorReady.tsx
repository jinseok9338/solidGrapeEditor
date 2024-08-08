import { JSX, onMount } from "solid-js";
import { useEditorOptions } from "./context/EditorOptions";

const EditorReady = (props: { children?: JSX.Element }) => {
  const options = useEditorOptions();
  onMount(() => options.setReady(true));
  return <>{props.children}</>;
};

export default EditorReady;
