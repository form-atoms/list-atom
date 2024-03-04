import type { AtomStore, FormFieldValues, FormFields } from "form-atoms";
import { Fragment, FunctionComponent, useCallback } from "react";
import type { RenderProp } from "react-render-prop-type";

import type { ListAtom, ListItem } from "../../atoms/list-atom";
import { useList } from "../../hooks";

export type RemoveButtonProps = { remove: () => void };
export type RemoveButtonProp = RenderProp<RemoveButtonProps, "RemoveButton">;

export type AddButtonProps<Fields extends FormFields = Record<string, never>> =
  {
    add: (fields?: Fields) => void;
  };
export type AddButtonProp<Fields extends FormFields> = RenderProp<
  AddButtonProps<Fields>,
  "AddButton"
>;

export type EmptyProp = RenderProp<unknown, "Empty">;

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
  /**
   * A component with an onClick handler bound to remove the current item from the list.
   */
  RemoveButton: FunctionComponent;
};
export type ListItemProp<Fields extends FormFields> = RenderProp<
  ListItemProps<Fields>
>;

export type ListProps<Fields extends FormFields, Value> = Partial<
  RemoveButtonProp & AddButtonProp<Fields> & EmptyProp
> & {
  /**
   * A list atom.
   */
  atom: ListAtom<Fields, Value>;
  initialValue?: Value[];
  /**
   * When using atoms with a scope, the provider with the same scope will be used.
   * The recommendation for the scope value is a unique symbol. The primary use case
   * of scope is for library usage.
   */
  store?: AtomStore;
} & ListItemProp<Fields>;

export function List<
  Fields extends FormFields,
  Value = FormFieldValues<Fields>,
>({
  atom,
  initialValue,
  children,
  RemoveButton = ({ remove }) => (
    <button type="button" onClick={remove}>
      Remove
    </button>
  ),
  AddButton = ({ add }) => (
    <button type="button" onClick={() => add()}>
      Add item
    </button>
  ),
  Empty,
}: ListProps<Fields, Value>) {
  const { add, isEmpty, items } = useList(atom, { initialValue });

  return (
    <>
      {isEmpty && Empty ? <Empty /> : undefined}
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
            RemoveButton: () => <RemoveButton remove={remove} />,
          })}
        </Fragment>
      ))}
      <AddButton
        add={useCallback((fields?: Fields) => add(undefined, fields), [add])}
      />
    </>
  );
}
