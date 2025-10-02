import type { FormFields } from "form-atoms";
import { FunctionComponent } from "react";

import { type AddProps, createAdd } from "./add";
import { type EmptyProps, createEmpty } from "./empty";
import { type ItemProps, createItem } from "./item";
import { type ListProps, createList } from "./list";
import { Nested, type NestedProps } from "./nested";
import type { ListAtom } from "../atoms";

export type Components<Fields extends FormFields> = {
  /**
   * A component to initialize the listAtom.
   */
  List: FunctionComponent<ListProps<Fields>> & {
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
     * A utility to re-create the components bound to list from a prop.
     */
    Nested: FunctionComponent<NestedProps<any>>;
  };
};

/**
 * Creates compound components for the List component.
 * It applies the given atom to each of the components, eliminating the need for React.Context.
 * @param atom
 */
export function createComponents<Fields extends FormFields>(
  listAtom: ListAtom<Fields, any>,
) {
  const root = createList(listAtom);

  Object.assign(root.List, {
    ...createAdd(listAtom),
    ...createEmpty(listAtom),
    ...createItem(listAtom),
    Nested,
  });

  return root;
}
