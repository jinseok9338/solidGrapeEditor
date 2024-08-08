import type gjs from "grapesjs";
import type { Editor, EditorConfig, ProjectData } from "grapesjs";

import { useEditorInstance } from "./context/EditorInstance";
import { useEditorOptions } from "./context/EditorOptions";
import { cx, noop } from "./utils";
import { convertStyleStringToObject, loadScript, loadStyle } from "./utils/dom";
import {
  GrapesPlugins,
  PluginToLoad,
  PluginTypeToLoad,
  initPlugins,
} from "./utils/plugins";
import { JSX } from "solid-js/jsx-runtime";
import { createEffect, createSignal, onCleanup, splitProps } from "solid-js";

export interface EditorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  grapesjs: string | typeof gjs;
  /**
   * GrapesJS options.
   */
  options?: EditorConfig;

  /**
   * Load GrapesJS CSS file asynchronously from URL.
   * @example 'https://unpkg.com/grapesjs/dist/css/grapes.min.css'
   */
  grapesjsCss?: string;

  /**
   * Array of plugins.
   * Differently from the GrapesJS `plugins` option, this one allows also you to load plugins
   * asynchronously from a CDN URL.
   * @example
   * plugins: [
   *  {
   *    // The id should be name of the plugin that will be actually loaded
   *    id: 'gjs-blocks-basic',
   *    src: 'https://unpkg.com/grapesjs-blocks-basic',
   *    options: {}
   *  }
   *  // plugin already loaded in the global scope (eg. loaded via CND in HTML)
   *  'grapesjs-plugin-forms',
   *  // plugin as a function
   *  myPlugin,
   * ]
   */
  plugins?: PluginTypeToLoad[];

  /**
   * Callback triggered once the editor instance is created.
   */
  onEditor?: (editor: Editor) => void;

  /**
   * Callback triggered once the editor is ready (mounted and loaded data from the Storage).
   */
  onReady?: (editor: Editor) => void;

  /**
   * Callback triggered on each update in the editor project.
   * The updated ProjectData (JSON) is passed as a first argument.
   */
  onUpdate?: (projectData: ProjectData, editor: Editor) => void;

  /**
   * Avoid showing children of the editor until the editor is ready (mounted and loaded data from the Storage).
   */
  waitReady?: boolean | JSX.Element;
}

const EditorInstance = (props: EditorProps) => {
  const [local, rest] = splitProps(props, [
    "children",
    "style",
    "options",
    "plugins",
    "grapesjs",
    "grapesjsCss",
    "onEditor",
    "onReady",
    "onUpdate",
    "waitReady",
    "class",
  ]);
  const { setEditor, editor } = useEditorInstance();
  const editorOptions = useEditorOptions();

  const [isEditorReady, setEditorReady] = createSignal(false);
  let editorRef: HTMLDivElement;

  createEffect(() => {
    // Wait until all refs are loaded
    if (!editorOptions.state.ready || !editorRef) {
      return;
    }

    const defaultContainer = editorRef;
    const canvasContainer = editorOptions.state.refCanvas;

    const [pluginOptions, setPluginOptions] = createSignal<
      PluginToLoad["options"]
    >({});
    const [loadedPlugins, setLoadedPlugins] = createSignal<GrapesPlugins[]>([]);

    const loadEditor = (grapes: typeof gjs) => {
      const config: EditorConfig = {
        height: "100vh",
        ...local.options,
        plugins: [...loadedPlugins(), ...(local.options?.plugins || [])],
        pluginsOpts: {
          ...local.options?.pluginsOpts,
          ...pluginOptions(),
        },
        modal: {
          ...local.options?.modal,
          custom: !!editorOptions.state.customModal,
        },
        assetManager: {
          ...local.options?.assetManager,
          custom: !!editorOptions.state.customAssets,
        },
        styleManager: {
          ...local.options?.styleManager,
          custom: !!editorOptions.state.customStyles,
        },
        blockManager: {
          ...local.options?.blockManager,
          custom: !!editorOptions.state.customBlocks,
        },
        richTextEditor: {
          ...local.options?.richTextEditor,
          custom: !!editorOptions.state.customRte,
        },
        layerManager: {
          ...local.options?.layerManager,
          custom: !!editorOptions.state.customLayers,
        },
        traitManager: {
          ...local.options?.traitManager,
          custom: !!editorOptions.state.customTraits,
        },
        selectorManager: {
          ...local.options?.selectorManager,
          custom: !!editorOptions.state.customSelectors,
        },
        container: canvasContainer || defaultContainer,
        customUI: !!canvasContainer,
        // Disables all default panels if Canvas is used
        ...(canvasContainer
          ? {
              panels: { defaults: [] },
            }
          : {}),
      };

      const edittorInit = grapes.init(config);
      setEditor(edittorInit);
      local.onEditor?.(edittorInit);

      if (local.onUpdate) {
        editor()?.on("update", () => {
          local.onUpdate?.(edittorInit.getProjectData(), editor()!);
        });
      }

      editor()?.onReady(() => {
        setEditorReady(true);
        local.onReady?.(editor()!);
      });
    };

    const init = async () => {
      if (local.grapesjsCss) {
        await loadStyle(local.grapesjsCss);
      }

      const pluginsRes = await initPlugins(local.plugins ?? []);

      setLoadedPlugins(pluginsRes.plugins);
      setPluginOptions(pluginsRes.pluginOptions);

      // Load GrapesJS

      if (typeof local.grapesjs === "string") {
        await loadScript(local.grapesjs);
        loadEditor((window as any).grapesjs);
      } else {
        loadEditor(local.grapesjs);
      }
    };

    init();
    onCleanup(() => editor()?.destroy());
  });

  const height = local.options?.height ?? "100%";
  const width = local.options?.width ?? "100%";
  const editorCls = cx("gjs-editor-wrapper", local.class);
  const isWaitingReady = local.waitReady && !isEditorReady();
  const styleObject =
    typeof local.style === "string"
      ? convertStyleStringToObject(local.style)
      : local.style;
  const styleRes = { ...styleObject, height, width };

  const styleEditorRes: JSX.CSSProperties = {
    ...styleRes,
    ...(isWaitingReady
      ? {
          opacity: 0,
          width: 0,
          height: 0,
        }
      : {}),
  };
  return (
    <>
      {local.waitReady && !isEditorReady() ? (
        <div class={editorCls} style={styleRes} children={local.waitReady} />
      ) : null}
      <div
        {...rest}
        ref={(el) => (editorRef = el)}
        class={editorCls}
        style={styleEditorRes}
      >
        {local.children}
      </div>
    </>
  );
};

export default EditorInstance;
