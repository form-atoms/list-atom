import { useMemo } from "react";
import type { FormFields, FormFieldValues } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";

import type { ListAtom } from "../atoms";
import { type ListComponents, createList } from "./list";

export type NestedProps<Fields extends FormFields> = {
  atom: ListAtom<Fields, FormFieldValues<Fields>>;
} & RenderProp<ListComponents<Fields>>;

export function Nested<Fields extends FormFields>({
  atom,
  children,
}: NestedProps<Fields>) {
  const components = useMemo(() => createList(atom), [atom]);

  return children(components);
}
