import { IoEyeOutline } from "solid-icons/io";
import { IoEyeOffOutline } from "solid-icons/io";
import { BsMenuDown } from "solid-icons/bs";

import type { Component } from "grapesjs";
//import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MAIN_BORDER_COLOR, cx } from "../common";
import { createEffect, createSignal, JSX, onCleanup } from "solid-js";
import { useEditor } from "@/dependency/context/EditorInstance";

export declare interface LayerItemProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  component: Component;
  level: number;
  draggingCmp?: Component;
  dragParent?: Component;
}

const itemStyle = { maxWidth: `100%` };

export default function LayerItem({
  component,
  draggingCmp,
  dragParent,
  ...props
}: LayerItemProps) {
  const editor = useEditor();

  let layerRef: HTMLDivElement;
  const [layerData, setLayerData] = createSignal(
    editor()?.Layers.getLayerData(component)
  );
  // const { open, selected, hovered, components, visible, name } = layerData;
  const componentsIds = layerData()?.components.map((cmp) => cmp.getId());
  const isDragging = draggingCmp === component;
  const cmpHash = componentsIds?.join("-");
  const level = props.level + 1;
  const isHovered = layerData()?.hovered || dragParent === component;

  createEffect(() => {
    level === 0 && setLayerData(editor()?.Layers.getLayerData(component));
    if (layerRef) {
      (layerRef as any).__cmp = component;
    }
  });

  createEffect(() => {
    const up = (cmp: Component) => {
      cmp === component && setLayerData(editor()?.Layers.getLayerData(cmp));
    };
    const ev = editor()?.Layers.events.component;
    if (ev) {
      editor()?.on(ev, up);
    }

    onCleanup(() => {
      if (ev) {
        editor()?.off(ev, up);
      }
    });
  });

  const cmpToRender = layerData()?.components.map((cmp) => (
    <LayerItem
      component={cmp}
      level={level}
      draggingCmp={draggingCmp}
      dragParent={dragParent}
    />
  ));

  const toggleOpen = (ev: MouseEvent) => {
    ev.stopPropagation();
    editor()?.Layers.setLayerData(component, { open: !open });
  };

  const toggleVisibility = (ev: MouseEvent) => {
    ev.stopPropagation();
    editor()?.Layers.setLayerData(component, {
      visible: !layerData()?.visible,
    });
  };

  const select = (event: MouseEvent) => {
    event.stopPropagation();
    editor()?.Layers.setLayerData(component, { selected: true }, { event });
  };

  const hover = (hovered: boolean) => {
    if (!hovered || !draggingCmp) {
      editor()?.Layers.setLayerData(component, { hovered });
    }
  };

  const wrapperCls = cx(
    "layer-item flex flex-col",
    layerData()?.selected && "bg-sky-900",
    (!layerData()?.visible || isDragging) && "opacity-50"
  );

  return (
    <div class={wrapperCls}>
      <div
        onClick={select}
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        class="group max-w-full"
        data-layer-item
        ref={(el) => (el = layerRef)}
      >
        <div
          class={cx(
            "flex items-center p-1 pr-2 border-b gap-1",
            level === 0 && "border-t",
            MAIN_BORDER_COLOR,
            isHovered && "bg-sky-700",
            layerData()?.selected && "bg-sky-500"
          )}
        >
          <div
            style={{ "margin-left": `${level * 10}px` }}
            class={cx(
              "cursor-pointer",
              !layerData()?.components.length && "pointer-events-none opacity-0"
            )}
            onClick={toggleOpen}
          >
            {layerData()?.open ? (
              <BsMenuDown size={0.7} />
            ) : (
              <BsMenuDown size={0.7} class="rotate-[-90deg]" />
            )}
          </div>
          <div class="truncate flex-grow" style={itemStyle}>
            {layerData()?.name}
          </div>
          <div
            class={cx(
              "group-hover:opacity-100 cursor-pointer",
              layerData()?.visible ? "opacity-0" : "opacity-100"
            )}
            onClick={toggleVisibility}
          >
            {layerData()?.visible ? (
              <IoEyeOutline size={0.7} />
            ) : (
              <IoEyeOffOutline size={0.7} />
            )}
          </div>
        </div>
      </div>
      {!!(layerData()?.open && layerData()?.components.length) && (
        <div class={cx("max-w-full", !open && "hidden")}>{cmpToRender}</div>
      )}
    </div>
  );
}