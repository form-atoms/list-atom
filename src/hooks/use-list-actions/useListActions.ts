import { FormFields, UseFieldOptions } from "form-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, startTransition } from "react";

import { ListAtom, ListItem } from "../../atoms/list-atom";

export const useListActions = <Fields extends FormFields, Value>(
  listAtom: ListAtom<Fields, Value>,
  options?: UseFieldOptions<Value[]>,
): UseListActions<Fields, Value> => {
  const atoms = useAtomValue(listAtom);
  const validate = useSetAtom(atoms.validate, options);
  const dispatchSplitList = useSetAtom(atoms._splitList, options);

  const remove = useCallback(
    (item: ListItem<Fields>) => {
      dispatchSplitList({ type: "remove", atom: item });
      startTransition(() => {
        validate("change");
      });
    },
    [dispatchSplitList, validate],
  );

  const add = useCallback(
    (before?: ListItem<Fields>, value?: Value) => {
      dispatchSplitList({
        type: "insert",
        value: atoms.buildItem(value),
        before,
      });
      startTransition(() => {
        validate("change");
      });
    },
    [dispatchSplitList, validate, atoms],
  );

  const move = useCallback(
    (item: ListItem<Fields>, before?: ListItem<Fields>) => {
      dispatchSplitList({ type: "move", atom: item, before });
    },
    [dispatchSplitList],
  );

  return useMemo(() => ({ remove, add, move }), [remove, add, move]);
};

export type UseListActions<Fields extends FormFields, Value> = {
  /**
   * Removes the item from the list.
   *
   * @param item - An item from the listAtom's splitList array.
   */
  remove: (item: ListItem<Fields>) => void;
  /**
   * Appends a new item to the list by default, when no 'before' position is used.
   * Optionally pass the item value.
   *
   * @param before - An item from the listAtom's splitList array.
   * @param value - A custom list item value.
   */
  add: (
    before?: ListItem<Fields> | undefined,
    value?: Value | undefined,
  ) => void;
  /**
   * Moves the item to the end of the list, or where specified when the 'before' is defined.
   *
   * @param item - A splitList item to be moved.
   * @param before - A splitList item before which to place the moved item.
   */
  move: (item: ListItem<Fields>, before?: ListItem<Fields> | undefined) => void;
};
