import type { FunctionComponent, ReactNode } from "react";
import type { FormFields } from "form-atoms";

import type { ListAtom } from "../atoms/list-atom";

import { type ListProps, createList as createRoot } from "./list";
import { type AddProps, createAdd } from "./add";
import { type EmptyProps, createEmpty } from "./empty";
import { type ItemProps, createItem } from "./item";
import { type ListOfProps, ListOf } from "./list-of";

export * from "./list-of";

export type ListComponents<Fields extends FormFields> = {
  /**
   * A component to initialize the listAtom value.
   */
  List: FunctionComponent<ListProps<Fields>> & {
    /**
     * A component to control adding new or initialized items to the list.
     */
    Add: FunctionComponent<AddProps<Fields>>;
    /**
     * A component which renders children only when the list is empty.
     */
    Empty: FunctionComponent<EmptyProps>;
    /**
     * A component to iterate and render each of the list items.
     */
    Item: FunctionComponent<ItemProps<Fields>>;
    /**
     * A component to create these ListComponents for a nested listAtom within a <List.Item>
     */
    Of: <Fields extends FormFields>(props: ListOfProps<Fields>) => ReactNode;
    /**
     * @alias Of
     * @deprecated Use `Of` instead.
     */
    Nested: <Fields extends FormFields>(
      props: ListOfProps<Fields>,
    ) => ReactNode;
  };
};

export function createList<Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
): ListComponents<Fields> {
  const root = createRoot(listAtom);

  Object.assign(root.List, {
    ...createAdd(listAtom),
    ...createEmpty(listAtom),
    ...createItem(listAtom),
    Of: ListOf,
    Nested: ListOf, // deprecated
  });

  return root as ListComponents<Fields>;
}
