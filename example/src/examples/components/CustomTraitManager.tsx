import { For, Show } from "solid-js";

import TraitPropertyField from "./TraitPropertyField";
import { TraitsResultProps } from "@/dependency/TraitsProvider";

export default function CustomTraitManager({
  traits,
}: Omit<TraitsResultProps, "Container">) {
  return (
    <div class="gjs-custom-style-manager text-left mt-3 p-1">
      <Show
        when={traits.length > 0}
        fallback={<div>No properties available</div>}
      >
        <For each={traits}>
          {(trait) => <TraitPropertyField key={trait.getId()} trait={trait} />}
        </For>
      </Show>
    </div>
  );
}
