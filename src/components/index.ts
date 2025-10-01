import type { FormFields } from "form-atoms";
import { FunctionComponent } from "react";

import { type AddButtonProps, createAddButton } from "./add-button";
import { type EmptyProps, createEmpty } from "./empty";
import { ItemProps, createItem } from "./item";
import { createList } from "./list";
import { NestedList, type NestedListProps } from "./nested";
import type { ListAtom } from "../atoms";

export type Components<Fields extends FormFields> = {
  Add: FunctionComponent<AddButtonProps<Fields>>;
  Empty: FunctionComponent<EmptyProps>;
  Item: FunctionComponent<ItemProps<Fields>>;
  Nested: FunctionComponent<NestedListProps<any>>;
};

/**
 * Creates compound components for the List component.
 * It applies the given atom to each of the components, eliminating the need for React.Context.
 * @param atom
 */
export function createComponents<Fields extends FormFields>(
  listAtom: ListAtom<Fields, any>,
) {
  const List = createList(listAtom);

  return Object.assign(List, {
    Add: createAddButton(listAtom),
    Empty: createEmpty(listAtom),
    Item: createItem(listAtom),
    Nested: NestedList,
  });
}
