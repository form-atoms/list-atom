import type { PropsWithChildren } from "react";
import type { AtomStore, FormFieldValues, FormFields } from "form-atoms";

import type { ListAtom } from "../../atoms/list-atom";
import { useFieldInitialValue } from "../../hooks";

export type ListProps<Value> = PropsWithChildren<{
  initialValue?: Value[];
  /**
   * When using atoms with a scope, the provider with the same scope will be used.
   * The recommendation for the scope value is a unique symbol. The primary use case
   * of scope is for library usage.
   */
  store?: AtomStore;
}>;

export function createList<Fields extends FormFields>(
  listAtom: ListAtom<Fields, any>,
) {
  return function List<
    Fields extends FormFields,
    Value = FormFieldValues<Fields>,
  >({ initialValue, store, children }: ListProps<Value>) {
    useFieldInitialValue(listAtom, initialValue, { store });

    return <>{children}</>;
  };
}
