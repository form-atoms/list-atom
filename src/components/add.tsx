import type { FormFields, FormFieldValues } from "form-atoms";
import type { ListAtom } from "../atoms";
import type { ListItemForm } from "../atoms/list-atom/listItemForm";
import { useListActions } from "../hooks";

type AddChildrenProps<Fields extends FormFields> = {
  /**
   * An action to append a new item to the end of the list.
   * @param value optionaly set the items initial value.
   * @returns The created ListItemForm<Fields>
   */
  add: (value?: FormFieldValues<Fields>) => ListItemForm<Fields>;
  /**
   * Retrieves the fields of a given list item form.
   *
   * @param listItem - A list item form from which to get the fields.
   * @returns The fields of the specified list item form.
   */
  getItemFields: (listItem: ListItemForm<Fields>) => Fields;
};

export type AddProps<Fields extends FormFields> = Partial<{
  children: (props: AddChildrenProps<Fields>) => React.ReactNode;
}>;

export function createAdd<Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
) {
  function Add({
    children = ({ add }) => (
      <button type="button" onClick={() => add()}>
        Add item
      </button>
    ),
  }: AddProps<Fields>) {
    const actions = useListActions(listAtom);

    return children({
      add: (value) => actions.add(undefined, value),
      getItemFields: actions.getItemFields,
    });
  }

  return { Add };
}
