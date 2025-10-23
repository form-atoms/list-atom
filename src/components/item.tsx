import { Fragment } from "react";
import type { FormFieldValues, FormFields } from "form-atoms";

import type { ListItemForm } from "../atoms/list-atom/listItemForm";
import type { ListAtom, SplitListItem } from "../atoms/list-atom";
import { useList } from "../hooks";

export type ListItemProps<Fields extends FormFields> = {
  /**
   * The fields of the current item, as created with the listAtom's `fields` config function.
   */
  fields: Fields;
  /**
   * The item from the internal splitList.
   */
  item: SplitListItem<Fields>;
  /**
   * The index of the current item.
   */
  index: number;
  /**
   * Total count of items in the list.
   */
  count: number;
  /**
   * Append a new item to the list.
   * When called with the current item, it will prepend it.
   * @returns The created ListItemForm<Fields>
   */
  add: (
    before?: SplitListItem<Fields>,
    value?: FormFieldValues<Fields>,
  ) => ListItemForm<Fields>;
  /**
   * Removes the current item from the list.
   */
  remove: () => void;
  /**
   * Moves the current item one slot up in the list.
   * Supports carousel - the first item will become the last.
   */
  moveUp: () => void;
  /**
   * Moves the current item one slot down in the list.
   * Supports carousel - the last item will become the first.
   */
  moveDown: () => void;
};

export type ItemProps<Fields extends FormFields> = {
  children: (props: ListItemProps<Fields>) => React.ReactNode;
};

export function createItem<Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
) {
  function Item({ children }: ItemProps<Fields>) {
    const { add, items } = useList(listAtom);

    return (
      <Fragment>
        {items.map(({ fields, key, item, remove, moveUp, moveDown }, index) => (
          <Fragment key={key}>
            {children({
              item,
              fields,
              index,
              count: items.length,
              add,
              remove,
              moveUp,
              moveDown,
            })}
          </Fragment>
        ))}
      </Fragment>
    );
  }

  return { Item };
}
