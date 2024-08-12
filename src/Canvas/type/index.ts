import { Coordinates } from "../../common/type";

export interface CanvasConfig {
  /**
   * style prefix for the components inside the canvas
   */
  stylePrefix?: string;

  /**
   * Append external scripts to the `<head>` of the iframe.
   * Be aware that these scripts will not be printed in the export code.
   * @default []
   * @example
   * scripts: [ 'https://...1.js', 'https://...2.js' ]
   * // or passing objects as attributes
   * scripts: [ { src: '/file.js', someattr: 'value' }, ... ]
   * to get the necessary scripts, you can use the following command:
   */
  scripts?: (string | Record<string, any>)[];

  /**
   * Append external styles to the `<head>` of the iframe.
   * Be aware that these scripts will not be printed in the export code.
   * @default []
   * @example
   * styles: [ 'https://...1.css', 'https://...2.css' ]
   * // or passing objects as attributes
   * styles: [ { href: '/style.css', someattr: 'value' }, ... ]
   */
  // styles?: (string | Record<string, any>)[];

  /**
   * Add custom badge naming strategy.
   * @example
   * customBadgeLabel: component => component.getName(),
   */
  // customBadgeLabel?: (component: Component) => string;

  // /**
  //  * Indicate when to start the autoscroll of the canvas on component/block dragging (value in px).
  //  * @default 50
  //  */
  // autoscrollLimit?: number;

  // /**
  //  * Experimental: external highlighter box
  //  */
  // extHl?: boolean;

  /**
   * Initial content to load in all frames.
   * The default value enables the standard mode for the iframe.
   * @default '<!DOCTYPE html>'
   */
  defaultCanvasContent?: string;

  /**
   * Initial style to load in all frames.
   */
  defaultCanvasStyle?: string;

  /**
   * When some textable component is selected and focused (eg. input or text component), the editor
   * stops some commands (eg. disables the copy/paste of components with CTRL+C/V to allow the copy/paste of the text).
   * This option allows to customize, by a selector, which element should not be considered textable.
   */
  notTextable?: string[];

  /**
   * By default, the editor allows to drop external elements by relying on the native HTML5
   * drag & drop API (eg. like a D&D of an image file from your desktop).
   * If you want to customize how external elements are interpreted by the editor, you can rely
   * on `canvas:dragdata` event, eg. https://github.com/GrapesJS/grapesjs/discussions/3849
   * @default true
   */
  allowExternalDrop?: boolean;

  /**
   * Disable the rendering of built-in canvas spots.
   *
   * Read here for more information about [Canvas Spots](https://grapesjs.com/docs/modules/Canvas.html#canvas-spots).
   * @example
   * // Disable only the hover type spot
   * customSpots: { hover: true },
   *
   * // Disable all built-in spots
   * customSpots: true,
   */
  // customSpots?: boolean | Partial<Record<CanvasSpotBuiltInTypes, boolean>>;

  /**
   * Experimental: enable infinite canvas.
   */
  infiniteCanvas?: boolean;
  currentFrameId: number;
  frames: Frame[];
  zoom: number;
  x: number;
  y: number;
  pointer: Coordinates;
  pointerScreen: Coordinates;
}

export interface Frame {
  id: number;
  // this is content of the frame
  content: string;
  position: number;
}
