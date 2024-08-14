import { Image } from "@unpic/solid";
import { Component, JSX } from "solid-js";
import grabIcon from "../../../assets/image/handgrab.svg";
import { cn } from "@/utils";

interface FrameHandlerProps {
  name: string;
  children: JSX.Element;
}

const FrameHandlerMenu = () => {
  return (
    <div class="flex gap-[2px] bg-blue-500 rounded-t-sm">
      <Image src={grabIcon} width={20} height={20} class={cn("cursor-grab")} />
    </div>
  );
};

export const FrameHandler: Component<FrameHandlerProps> = (props) => {
  return (
    <div class="group relative">
      <div class="justify-between absolute w-full top-[-16px] hidden group-hover:flex">
        <span class="text-xs">{props.name}</span>
        <FrameHandlerMenu />
      </div>
      <div class="shadow-none group-hover:shadow-[0_0_0_2px_rgba(59,130,246,1)]">
        {props.children}
      </div>
    </div>
  );
};
