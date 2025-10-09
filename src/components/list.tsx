import type { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import type { AtomStore, FormFieldValues, FormFields } from "form-atoms";

import type { ListAtom } from "../atoms/list-atom";
import { useFieldInitialValue } from "../hooks";

import { type AddProps, createAdd } from "./add";
import { type EmptyProps, createEmpty } from "./empty";
import { type ItemProps, createItem } from "./item";
import { type NestedProps, Nested } from "./nested";

export type ListComponents<Fields extends FormFields> = {
  /**
   * A component to initialize the listAtom value.
   */
  List: FunctionComponent<ListProps<FormFieldValues<Fields>>> & {
    /**
     * A component to iterate and render each of the list items.
     */
    Item: FunctionComponent<ItemProps<Fields>>;
    /**
     * A component to control adding new or initialized items to the list.
     */
    Add: FunctionComponent<AddProps<Fields>>;
    /**
     * A component which renders children only when the list is empty.
     */
    Empty: FunctionComponent<EmptyProps>;
    /**
     * A component to create these ListComponents for a nested listAtom within a <List.Item>
     */
    Nested: <Fields extends FormFields>(
      props: NestedProps<Fields>,
    ) => ReactElement | null;
  };
};

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
  listAtom: ListAtom<Fields, FormFieldValues<Fields>>,
): ListComponents<Fields> {
  function List({
    initialValue,
    store,
    children,
  }: ListProps<FormFieldValues<Fields>>) {
    useFieldInitialValue(listAtom, initialValue, { store });

    return <>{children}</>;
  }

  return {
    List: Object.assign(List, {
      ...createAdd(listAtom),
      ...createEmpty(listAtom),
      ...createItem(listAtom),
      Nested,
    }),
  };
}
