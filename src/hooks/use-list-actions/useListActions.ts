import { useCallback, useMemo, startTransition } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { FormFields, FormFieldValues, UseAtomOptions } from "form-atoms";

import type { ListAtom, ListItem } from "../../atoms/list-atom";
import type { ListItemForm } from "../../atoms/list-atom/listItemForm";

export const useListActions = <Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
  options?: UseAtomOptions,
): UseListActions<Fields> => {
  const atoms = useAtomValue(listAtom, options);
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
    (before?: ListItem<Fields>, value?: FormFieldValues<Fields>) => {
      const item = atoms.buildItem(value);

      dispatchSplitList({
        type: "insert",
        value: item,
        before,
      });
      startTransition(() => {
        validate("change");
      });

      return item;
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

export type UseListActions<Fields extends FormFields> = {
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
   * @returns The created ListItemForm<Fields>
   */
  add: (
    before?: ListItem<Fields> | undefined,
    value?: FormFieldValues<Fields> | undefined,
  ) => ListItemForm<Fields>;
  /**
   * Moves the item to the end of the list, or where specified when the 'before' is defined.
   *
   * @param item - A splitList item to be moved.
   * @param before - A splitList item before which to place the moved item.
   */
  move: (item: ListItem<Fields>, before?: ListItem<Fields> | undefined) => void;
};
