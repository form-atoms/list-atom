import { useMemo } from "react";
import type { FormFields } from "form-atoms";

import type { ListAtom } from "../atoms";
import { type ListComponents, createList } from "./index";

export type ListOfProps<Fields extends FormFields> = {
  atom: ListAtom<Fields>;
} & { children: (props: ListComponents<Fields>) => React.ReactNode };

export function ListOf<Fields extends FormFields>({
  atom,
  children,
}: ListOfProps<Fields>) {
  const components = useMemo(() => createList(atom), [atom]);

  return children(components);
}
