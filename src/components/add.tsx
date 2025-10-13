import type { FormFields, FormFieldValues } from "form-atoms";

import type { ListAtom } from "../atoms";
import { useListActions } from "../hooks";

type AddChildrenProps<Fields extends FormFields> = {
  /**
   * An action to append a new item to the end of the list.
   * @param value optionaly set the items initial value.
   */
  add: (value?: FormFieldValues<Fields>) => void;
};

export type AddProps<Fields extends FormFields> = Partial<{
  children: (props: AddChildrenProps<Fields>) => React.ReactNode;
}>;

export function createAdd<Fields extends FormFields>(
  listAtom: ListAtom<Fields, FormFieldValues<Fields>>,
) {
  function Add({
    children = ({ add }) => (
      <button type="button" onClick={() => add()}>
        Add item
      </button>
    ),
  }: AddProps<Fields>) {
    const actions = useListActions(listAtom);

    return children({ add: (value) => actions.add(undefined, value) });
  }

  return { Add };
}
