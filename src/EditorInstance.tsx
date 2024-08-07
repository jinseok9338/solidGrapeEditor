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
import { createEffect, createSignal, onCleanup } from "solid-js";
import { create } from "domain";

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

const EditorInstance = ({
  children,
  style,
  options = {},
  plugins = [],
  grapesjs,
  grapesjsCss,
  onEditor = noop,
  onReady,
  onUpdate,
  waitReady,
  class: className,
  ...rest
}: EditorProps) => {
  const { setEditor } = useEditorInstance();
  const editorOptions = useEditorOptions();

  const [isEditorReady, setEditorReady] = createSignal(false);
  let editorRef: HTMLDivElement;

  createEffect(() => {
    // Wait until all refs are loaded
    if (!editorOptions.ready || !editorRef) {
      return;
    }

    const defaultContainer = editorRef;
    const canvasContainer = editorOptions.refCanvas;

    let editor: Editor | undefined;
    let pluginOptions: PluginToLoad["options"] = {};
    let loadedPlugins: GrapesPlugins[] = [];

    const loadEditor = (grapes: typeof gjs) => {
      const config: EditorConfig = {
        height: "100%",
        ...options,
        plugins: [...loadedPlugins, ...(options.plugins || [])],
        pluginsOpts: {
          ...options.pluginsOpts,
          ...pluginOptions,
        },
        modal: {
          ...options.modal,
          custom: !!editorOptions.customModal,
        },
        assetManager: {
          ...options.assetManager,
          custom: !!editorOptions.customAssets,
        },
        styleManager: {
          ...options.styleManager,
          custom: !!editorOptions.customStyles,
        },
        blockManager: {
          ...options.blockManager,
          custom: !!editorOptions.customBlocks,
        },
        richTextEditor: {
          ...options.richTextEditor,
          custom: !!editorOptions.customRte,
        },
        layerManager: {
          ...options.layerManager,
          custom: !!editorOptions.customLayers,
        },
        traitManager: {
          ...options.traitManager,
          custom: !!editorOptions.customTraits,
        },
        selectorManager: {
          ...options.selectorManager,
          custom: !!editorOptions.customSelectors,
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
      editor = grapes.init(config);
      setEditor(editor);
      onEditor(editor);

      if (onUpdate) {
        editor.on("update", () => {
          onUpdate(editor!.getProjectData(), editor!);
        });
      }

      editor.onReady(() => {
        setEditorReady(true);
        onReady?.(editor!);
      });
    };

    const init = async () => {
      grapesjsCss && (await loadStyle(grapesjsCss));
      const pluginsRes = await initPlugins(plugins);
      loadedPlugins = pluginsRes.plugins;
      pluginOptions = pluginsRes.pluginOptions;

      // Load GrapesJS
      if (typeof grapesjs === "string") {
        await loadScript(grapesjs);
        loadEditor((window as any).grapesjs);
      } else {
        loadEditor(grapesjs);
      }
    };

    init();
    onCleanup(() => editor?.destroy());
  });

  const height = options.height ?? "100%";
  const width = options.width ?? "100%";
  const editorCls = cx("gjs-editor-wrapper", className);
  const isWaitingReady = waitReady && !isEditorReady();
  const styleObject =
    typeof style === "string" ? convertStyleStringToObject(style) : style;
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
      {waitReady && !isEditorReady() ? (
        <div class={editorCls} style={styleRes} children={waitReady} />
      ) : null}
      <div
        {...rest}
        ref={(el) => (editorRef = el)}
        class={editorCls}
        style={styleEditorRes}
      >
        {children}
      </div>
    </>
  );
};

export default EditorInstance;
