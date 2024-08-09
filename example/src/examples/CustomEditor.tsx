import { defaultEditorProps, MAIN_BORDER_COLOR } from "./common";
import CustomSelectorManager from "./components/CustomSelectorManager";
import CustomStyleManager from "./components/CustomStyleManager";
import CustomTraitManager from "./components/CustomTraitManager";
import CustomLayerManager from "./components/CustomLayerManager";
import CustomBlockManager from "./components/CustomBlockManager";
import CustomAssetManager from "./components/CustomAssetManager";
import CustomModal from "./components/CustomModal";
import Editor from "@/dependency/Editor";
import { EditorProps } from "@/dependency/EditorInstance";
import SelectorsProvider from "@/dependency/SelectorsProvider";
import StylesProvider from "@/dependency/StylesProvider";
import TraitsProvider from "@/dependency/TraitsProvider";
import LayersProvider from "@/dependency/LayersProvider";
import BlocksProvider from "@/dependency/BlocksProvider";
import AssetsProvider from "@/dependency/AssetsProvider";
import ModalProvider from "@/dependency/ModalProvider";
import Topbar from "./components/TopBar";
import Canvas from "@/dependency/Canvas";
import RightSidebar from "./components/RightSideBar";

export default function DefaultCustomEditor(props: Partial<EditorProps>) {
  return (
    <>
      <Editor
        class="gjs-default-custom-editor"
        {...defaultEditorProps}
        {...props}
      >
        <div class={`flex h-full border-t ${MAIN_BORDER_COLOR}`}>
          <div
            class="gjs-column-m   flex flex-col flex-grow"
            style={{ width: "600px" }}
          >
            <Topbar
              class="min-h-[48px]"
              style={{
                height: "48px",
              }}
            />
            <Canvas class="flex-grow gjs-custom-editor-canvas" />
          </div>
          <RightSidebar
            class={`gjs-column-r w-[300px] border-l ${MAIN_BORDER_COLOR}`}
          />
        </div>
        <ModalProvider>
          {({ open, title, content, close }) => (
            <CustomModal
              open={open}
              title={title}
              children={content}
              close={close}
            />
          )}
        </ModalProvider>
        <AssetsProvider>
          {({ assets, select, close, Container }) => (
            <Container>
              <CustomAssetManager
                assets={assets}
                select={select}
                close={close}
              />
            </Container>
          )}
        </AssetsProvider>
      </Editor>
    </>
  );
}
