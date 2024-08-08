import { AiOutlineClose } from "solid-icons/ai";
import { cx, MAIN_BG_COLOR, MAIN_TXT_COLOR } from "../common";
import { JSX } from "solid-js/jsx-runtime";
import { ComponentProps } from "solid-js";

const modalStyle = cx(
  "fixed inset-0 flex items-center justify-center",
  "bg-black bg-opacity-50"
);

const contentStyle = cx(
  "relative w-full max-w-3xl p-4",
  "bg-white border-2 border-black shadow-lg",
  "flex flex-col max-h-[90vh] overflow-hidden rounded"
);

const headerStyle = cx("flex justify-between items-center pb-3");

const closeIconStyle = cx("cursor-pointer");

interface CustomModalProps extends Omit<ComponentProps<"div">, "title"> {
  title: JSX.Element;
  close: () => void;
  open: boolean;
}

export default function CustomModal({
  children,
  title,
  close,
  open,
  ...props
}: CustomModalProps) {
  if (!open) return null;

  return (
    <div class={modalStyle} onClick={close}>
      <div class={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div class={headerStyle}>
          <div class="text-lg">{title}</div>
          <div onClick={close} class={closeIconStyle}>
            <AiOutlineClose size={20} />
          </div>
        </div>
        <div class="flex-grow overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
