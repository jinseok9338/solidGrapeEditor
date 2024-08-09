import { FaSolidBrush } from "solid-icons/fa";
import { FiLayers } from "solid-icons/fi";
import { CgViewGrid } from "solid-icons/cg";
import { TbBoxMultiple } from "solid-icons/tb";
import { BiRegularCog } from "solid-icons/bi";

import CustomBlockManager from "./CustomBlockManager";
import { MAIN_BORDER_COLOR, cx } from "../common";
import CustomPageManager from "./CustomPageManager";
import CustomLayerManager from "./CustomLayerManager";
import CustomSelectorManager from "./CustomSelectorManager";
import CustomStyleManager from "./CustomStyleManager";
import CustomTraitManager from "./CustomTraitManager";
import { createSignal, JSX, Show } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectorsProvider from "@/dependency/SelectorsProvider";
import StylesProvider from "@/dependency/StylesProvider";
import TraitsProvider from "@/dependency/TraitsProvider";
import LayersProvider from "@/dependency/LayersProvider";
import BlocksProvider from "@/dependency/BlocksProvider";
import PagesProvider from "@/dependency/PagesProvider";
import {
  useEditor,
  useEditorInstance,
  useEditorMaybe,
} from "@/dependency/context/EditorInstance";

const defaultTabProps = {
  class: "!min-w-0",
};

enum TabsEnum {
  "First" = "First",
  "Second" = "Second",
  "Third" = "Third",
  "Fourth" = "Fourth",
  "Fifth" = "Fifth",
}

export default function RightSidebar(
  props: JSX.HTMLAttributes<HTMLDivElement>
) {
  const [selectedTab, setSelectedTab] = createSignal(TabsEnum.First);
  const handleOnChange = (value: TabsEnum) => {
    setSelectedTab(value);
  };
  const { editor } = useEditorInstance();

  return (
    <Show when={editor()}>
      <div class={cx("gjs-right-sidebar flex flex-col", props.class)}>
        <Tabs
          class="w-[400px]"
          value={selectedTab()}
          onChange={(ev) => handleOnChange(ev as TabsEnum)}
        >
          <TabsList>
            <TabsTrigger {...defaultTabProps} value={TabsEnum.First}>
              <FaSolidBrush size={20} />
            </TabsTrigger>
            <TabsTrigger {...defaultTabProps} value={TabsEnum.Second}>
              <BiRegularCog size={20} />
            </TabsTrigger>
            <TabsTrigger {...defaultTabProps} value={TabsEnum.Third}>
              <FiLayers size={20} />
            </TabsTrigger>
            <TabsTrigger {...defaultTabProps} value={TabsEnum.Fourth}>
              <CgViewGrid size={20} />
            </TabsTrigger>
            <TabsTrigger {...defaultTabProps} value={TabsEnum.Fifth}>
              <TbBoxMultiple size={20} />
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TabsEnum.First}>
            <>
              <SelectorsProvider>
                {(props) => <CustomSelectorManager {...props} />}
              </SelectorsProvider>
              <StylesProvider>
                {(props) => <CustomStyleManager {...props} />}
              </StylesProvider>
            </>
          </TabsContent>
          <TabsContent value={TabsEnum.Second}>
            <TraitsProvider>
              {(props) => <CustomTraitManager {...props} />}
            </TraitsProvider>
          </TabsContent>
          <TabsContent value={TabsEnum.Third}>
            <LayersProvider>
              {(props) => <CustomLayerManager {...props} />}
            </LayersProvider>
          </TabsContent>
          <TabsContent value={TabsEnum.Fourth}>
            <BlocksProvider>
              {(props) => <CustomBlockManager {...props} />}
            </BlocksProvider>
          </TabsContent>
          <TabsContent value={TabsEnum.Fifth}>
            <PagesProvider>
              {(props) => <CustomPageManager {...props} />}
            </PagesProvider>
          </TabsContent>
        </Tabs>
        <div
          class={cx("overflow-y-auto flex-grow border-t", MAIN_BORDER_COLOR)}
        ></div>
      </div>
    </Show>
  );
}
