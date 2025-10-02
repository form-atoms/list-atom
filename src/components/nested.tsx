import { useState } from "react";
import type { FormFields } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";

import type { ListAtom } from "../atoms";
import { type Components, createList } from "./list";

export type NestedProps<Fields extends FormFields> = {
  atom: ListAtom<Fields, any>;
} & RenderProp<Components<Fields>>;

export function Nested<Fields extends FormFields>({
  atom,
  children,
}: NestedProps<Fields>) {
  const [components] = useState(() => createList(atom));

  return children(components as any);
}
