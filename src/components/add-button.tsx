import type { FormFields } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";
import type { ListAtom } from "../atoms";

import { useListActions } from "../hooks";

export type AddButtonProps<Fields extends FormFields> = Partial<
  RenderProp<{
    add: (fields?: Fields) => void;
  }>
>;

export function createAddButton<Fields extends FormFields>(
  listAtom: ListAtom<Fields, any>,
) {
  return function AddButton({
    children = ({ add }) => (
      <button type="button" onClick={() => add()}>
        Add item
      </button>
    ),
  }: AddButtonProps<Fields>) {
    const actions = useListActions(listAtom);

    return children({ add: (fields) => actions.add(undefined, fields) });
  };
}
