import { onMount } from "solid-js";
import { useEditorOptions } from "./context/EditorOptions";

const EditorReady = () => {
  const options = useEditorOptions();
  onMount(() => options.setReady(true));
  return <></>;
};

export default EditorReady;
