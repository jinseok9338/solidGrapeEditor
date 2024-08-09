import { AiOutlineArrowLeft } from "solid-icons/ai";
import { AiOutlineArrowRight } from "solid-icons/ai";
import { BiRegularBorderRadius } from "solid-icons/bi";
import { AiOutlineFullscreen } from "solid-icons/ai";
import { BsFiletypeXml } from "solid-icons/bs";
import { BTN_CLS, MAIN_BORDER_COLOR, cx } from "../common";
import { For, JSX } from "solid-js";
import { useEditor } from "@/dependency/context/EditorInstance";

interface CommandButton {
  id: string;
  icon: JSX.Element;
  options?: Record<string, any>;
  disabled?: () => boolean;
}

export default function TopbarButtons(
  props: JSX.HTMLAttributes<HTMLDivElement>
) {
  const editor = useEditor();
  // const [, setUpdateCounter] = useState(0);

  const cmdButtons: CommandButton[] = [
    {
      id: "core:component-outline",
      // iconPath: mdiBorderRadius,
      icon: <BiRegularBorderRadius />,
    },
    {
      id: "core:fullscreen",
      // iconPath: mdiFullscreen,
      icon: <AiOutlineFullscreen />,
      options: { target: "#root" },
    },
    {
      id: "core:open-code",
      // iconPath: mdiXml,
      icon: <BsFiletypeXml />,
    },
    {
      id: "core:undo",
      // iconPath: mdiArrowULeftTop,
      icon: <AiOutlineArrowLeft />,
      disabled: () => !editor()?.UndoManager.hasUndo(),
    },
    {
      id: "core:redo",
      // iconPath: mdiArrowURightTop,
      icon: <AiOutlineArrowRight />,
      disabled: () => !editor()?.UndoManager.hasRedo(),
    },
  ];

  // useEffect(() => {
  //   const cmdEvent = "run stop";
  //   const updateEvent = "update";
  //   const updateCounter = () => setUpdateCounter((value) => value + 1);
  //   const onCommand = (id: string) => {
  //     cmdButtons.find((btn) => btn.id === id) && updateCounter();
  //   };
  //   editor.on(cmdEvent, onCommand);
  //   editor.on(updateEvent, updateCounter);

  //   return () => {
  //     editor.off(cmdEvent, onCommand);
  //     editor.off(updateEvent, updateCounter);
  //   };
  // }, []);

  return (
    <div class={cx("flex gap-3", props.class)}>
      <For each={cmdButtons}>
        {({ id, icon, disabled, options = {} }) => (
          <button
            type="button"
            class={cx(
              BTN_CLS,
              MAIN_BORDER_COLOR,
              editor()?.Commands.isActive(id) && "text-sky-300",
              disabled?.() && "opacity-50"
            )}
            onClick={() =>
              editor()?.Commands.isActive(id)
                ? editor()?.Commands.stop(id)
                : editor()?.Commands.run(id, options)
            }
            disabled={disabled?.()}
          >
            {icon}
          </button>
        )}
      </For>
    </div>
  );
}
