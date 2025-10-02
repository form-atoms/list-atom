import type { FormFields } from "form-atoms";
import type { RenderProp } from "react-render-prop-type";
import type { ListAtom } from "../atoms";

import { useListActions } from "../hooks";

export type AddProps<Fields extends FormFields> = Partial<
  RenderProp<{
    add: (fields?: Fields) => void;
  }>
>;

export function createAdd<Fields extends FormFields>(
  listAtom: ListAtom<Fields, any>,
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
