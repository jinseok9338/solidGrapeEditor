import EditorInstance, { EditorProps } from "./EditorInstance";
import EditorReady from "./EditorReady";
import { EditorInstanceProvider, EditorOptionsProvider } from "./context";

const Editor = ({ children, ...rest }: EditorProps) => {
  return (
    <EditorInstanceProvider>
      <EditorOptionsProvider>
        <EditorInstance {...rest}>
          {children}
          <EditorReady />
        </EditorInstance>
      </EditorOptionsProvider>
    </EditorInstanceProvider>
  );
};

export default Editor;
