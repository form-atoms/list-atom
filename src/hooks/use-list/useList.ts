import type { FormFields, UseFieldOptions } from "form-atoms";

import { type ListAtom, type ListItem } from "../../atoms/list-atom";
import { useFieldInitialValue } from "../use-field-initial-value";
import { UseListActions, useListActions } from "../use-list-actions";
import { useListState } from "../use-list-state";

export const useList = <Fields extends FormFields, Value>(
  listAtom: ListAtom<Fields, Value>,
  options?: UseFieldOptions<Value[]>,
): UseList<Fields> => {
  useFieldInitialValue(listAtom, options?.initialValue, options);
  const {
    items: splitItems,
    formList,
    formFields,
    isEmpty,
  } = useListState(listAtom, options);
  const { add, move, remove } = useListActions(listAtom, options);

  const items = splitItems.map((item, index) => ({
    item,
    key: `${formList[index]}`,
    fields: formFields[index]!,
    remove: () => remove(item),
    moveUp: () => move(item, splitItems[index - 1]),
    moveDown: () => move(item, splitItems[index + 2]),
  }));

  return { remove, add, move, isEmpty, items };
};

export type UseList<Fields extends FormFields> = UseListActions<Fields> & {
  /**
   * Resolved value from the list.empty atom.
   */
  isEmpty: boolean;
  items: {
    /**
     * The item from the internal splitList.
     */
    item: ListItem<Fields>;
    /**
     * Stable React key prop derived from atom id.
     */
    key: string;
    /**
     * The form fields of the current item.
     */
    fields: Fields;
    /**
     * A function to remove the current item from the list.
     */
    remove: () => void;
    /**
     * A helper function to move the item to the previous index in the list.
     */
    moveUp: () => void;
    /**
     * A helper function to move the item to the next index in the list.
     */
    moveDown: () => void;
  }[];
};
