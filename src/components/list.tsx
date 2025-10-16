import type { PropsWithChildren } from "react";
import type { AtomStore, FormFieldValues, FormFields } from "form-atoms";

import type { ListAtom } from "../atoms/list-atom";
import { useFieldInitialValue } from "../hooks";

export type ListProps<Fields extends FormFields> = PropsWithChildren<{
  initialValue?: FormFieldValues<Fields>[];
  /**
   * When using atoms with a scope, the provider with the same scope will be used.
   * The recommendation for the scope value is a unique symbol. The primary use case
   * of scope is for library usage.
   */
  store?: AtomStore;
}>;

export function createList<Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
) {
  function List({ initialValue, store, children }: ListProps<Fields>) {
    useFieldInitialValue(listAtom, initialValue, { store });

    return <>{children}</>;
  }

  return { List };
}
