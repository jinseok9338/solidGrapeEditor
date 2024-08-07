import { isString } from "./dom";
import { Portal } from "solid-js/web";
import { Component, createEffect, JSX } from "solid-js";

function createPortal(children: JSX.Element, el: HTMLElement): JSX.Element {
  return <Portal mount={el}>{children}</Portal>;
}

export const WrapDom = (el: HTMLElement | string) => {
  return function WrapElement() {
    let ref: HTMLDivElement;

    createEffect(() => {
      if (ref) {
        if (isString(el)) {
          ref.innerHTML = el;
        } else {
          ref.appendChild(el);
        }
      }
    });

    return <div ref={(el) => (ref = el)} />;
  };
};

export interface PortalContainerProps {
  children: JSX.Element;
}

export type PortalContainerResult = Component<PortalContainerProps>;

const elContainerMap = new WeakMap<HTMLElement, PortalContainerResult>();

export function portalContainer(el?: HTMLElement): PortalContainerResult {
  if (!el) {
    return () => null;
  }

  const prevResult = elContainerMap.get(el);

  if (prevResult) {
    return prevResult;
  }

  const result = function Container({ children }: PortalContainerProps) {
    return createPortal(children, el);
  };

  elContainerMap.set(el, result);

  return result;
}
