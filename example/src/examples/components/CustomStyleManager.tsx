import { For } from "solid-js";

import { MAIN_BG_COLOR } from "../common";
import StylePropertyField from "./StylePropertyField";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { StylesResultProps } from "@/dependency/StylesProvider";

export default function CustomStyleManager(
  props: Omit<StylesResultProps, "Container">
) {
  return (
    <div class="gjs-custom-style-manager text-left">
      <Accordion collapsible>
        <For each={props.sectors}>
          {(sector) => (
            <AccordionItem value={sector.getName()}>
              <AccordionTrigger class="!bg-slate-800">
                {sector.getName()}
              </AccordionTrigger>
              <AccordionContent class={`${MAIN_BG_COLOR} flex flex-wrap`}>
                <For each={sector.getProperties()}>
                  {(prop) => <StylePropertyField prop={prop} />}
                </For>
              </AccordionContent>
            </AccordionItem>
          )}
        </For>
      </Accordion>
    </div>
  );
}
