import type { FormFields, FormFieldValues } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";
import type { ListAtom } from "../atoms";

import { useListActions } from "../hooks";

export type AddProps<Fields extends FormFields> = Partial<
  RenderProp<{
    /**
     * An action to append a new item to the end of the list.
     * @param fields optionaly set initialized fields.
     */
    add: (value?: FormFieldValues<Fields>) => void;
  }>
>;

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

    return children({ add: (fields) => actions.add(undefined, fields) });
  }

  return { Add };
}
