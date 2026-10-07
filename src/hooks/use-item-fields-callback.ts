import type { FormFields } from "form-atoms";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import type { ListItemForm } from "../atoms/list-atom/listItemForm";

/**
 * A helper hook, to get the fields of recently added list item. (useful in in the <List.Add /> component)
 * @returns A callback function that retrieves the fields of a given list item form.
 */
export function useItemFieldsCallback() {
  return useAtomCallback(
    useCallback((get, _, listItem) => {
      return get(get(listItem).fields);
    }, []),
  ) as <Fields extends FormFields>(listItem: ListItemForm<Fields>) => Fields;
}
