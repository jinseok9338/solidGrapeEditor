import type { Device } from "grapesjs";
import { useEditorInstance } from "./context/EditorInstance";
import { isFunction, noop } from "./utils";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { createEffect, onCleanup } from "solid-js";

export type DevicesState = {
  /**
   * Array of devices.
   */
  devices: Device[];

  /**
   * Selected device id.
   */
  selected: string;

  /**
   * Select new device by id.
   */
  select: (deviceId: string) => void;
};

export type DevicesResultProps = DevicesState;

export interface DevicesProviderProps {
  children: (props: DevicesResultProps) => JSX.Element;
}

const DevicesProvider = ({ children }: DevicesProviderProps) => {
  const { editor } = useEditorInstance();
  const [propState, setPropState] = createStore<DevicesState>({
    devices: [],
    selected: "",
    select: noop,
  });

  createEffect(() => {
    if (!editor()) return;

    const event = editor()?.Devices.events.all;

    const up = () => {
      setPropState({
        devices: editor()?.Devices.getDevices(),
        selected: editor()?.Devices.getSelected()?.id as string,
        select: (id) => editor()?.Devices.select(id),
      });
    };
    if (event) {
      editor()?.on(event, up);
    }
    up();
    onCleanup(() => {
      if (event) {
        editor()?.off(event, up);
      }
    });
  });

  return editor() ? (isFunction(children) ? children(propState) : null) : null;
};

export default DevicesProvider;
