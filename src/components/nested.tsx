import { useState } from "react";
import type { FormFields } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";

import type { ListAtom } from "../atoms";
import { type Components, createComponents } from ".";

export type NestedListProps<Fields extends FormFields> = {
  atom: ListAtom<Fields, any>;
} & RenderProp<Components<Fields>>;

export function NestedList<Fields extends FormFields>({
  atom,
  children,
}: NestedListProps<Fields>) {
  const [components] = useState(() => createComponents(atom));

  return children(components as any);
}
