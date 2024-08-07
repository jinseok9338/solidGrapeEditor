// import { PropsWithChildren } from 'react';

import { JSX } from "solid-js/jsx-runtime";
import { useEditorMaybe } from "./context/EditorInstance";
/**
 * Load children once the editor is available
 */
const WithEditor = ({ children }: { children: JSX.Element }) => {
  const editor = useEditorMaybe();

  return editor() ? <>{children}</> : null;
};

export default WithEditor;
