import { Fragment } from "react";
import type { FormFieldValues, FormFields } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";

import type { ListAtom, ListItem } from "../atoms/list-atom";
import { useList } from "../hooks";

export type ListItemProps<Fields extends FormFields> = {
  /**
   * The fields of current item, as returned from the builder function.
   */
  fields: Fields;
  /**
   * The item from the internal splitList.
   */
  item: ListItem<Fields>;
  /**
   * The index of the current item.
   */
  index: number;
  /**
   * Total count of items in the list.
   */
  count: number;
  /**
   * Append a new item to the end of the list.
   * WHen called with current item, it will be prepend with a new item.
   */
  add: (before?: ListItem<Fields>) => void;
  /**
   * Removes the current item.
   */
  remove: () => void;
  /**
   * Moves the current item one slot up in the list.
   * When called for the first item, the action is no-op.
   */
  moveUp: () => void;
  /**
   * Moves the current item one slot down in the list.
   * When called for the last item, the item moves to the start of the list.
   */
  moveDown: () => void;
};

export type ItemProps<Fields extends FormFields> = RenderProp<
  ListItemProps<Fields>
>;

export function createItem<
  Fields extends FormFields,
  Value = FormFieldValues<Fields>,
>(listAtom: ListAtom<Fields, Value>) {
  return function ListItem({ children }: ItemProps<Fields>) {
    const { add, items } = useList(listAtom);

    return (
      <Fragment>
        {items.map(({ remove, fields, key, item, moveUp, moveDown }, index) => (
          <Fragment key={key}>
            {children({
              item,
              fields,
              add,
              remove,
              moveUp,
              moveDown,
              index,
              count: items.length,
            })}
          </Fragment>
        ))}
      </Fragment>
    );
  };
}
