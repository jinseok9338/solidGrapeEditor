import { For } from "solid-js";

import { MAIN_BG_COLOR } from "../common";
import StylePropertyField from "./StylePropertyField";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { StylesResultProps } from "@/dependency/StylesProvider";

export default function CustomStyleManager({
  sectors,
}: Omit<StylesResultProps, "Container">) {
  return (
    <div class="gjs-custom-style-manager text-left">
      <For each={sectors}>
        {(sector) => (
          <Accordion>
            <AccordionTrigger class="!bg-slate-800">
              {sector.getName()}
            </AccordionTrigger>
            <AccordionContent class={`${MAIN_BG_COLOR} flex flex-wrap`}>
              <For each={sector.getProperties()}>
                {(prop) => (
                  <StylePropertyField key={prop.getId()} prop={prop} />
                )}
              </For>
            </AccordionContent>
          </Accordion>
        )}
      </For>
    </div>
  );
}
