import type { FormFields } from "form-atoms";
import type { ReactNode } from "react";
import type { ListAtom } from "../atoms";

import { useListState } from "../hooks/use-list-state";

export type EmptyChildrenProps = {
  /**
   * Indicates whether the list has no items.
   */
  isEmpty: boolean;
  /**
   * Total count of items in the list.
   */
  count: number;
};

export type EmptyProps = {
  children?: ReactNode | ((props: EmptyChildrenProps) => ReactNode);
};

export function createEmpty<Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
) {
  function Empty({ children }: EmptyProps) {
    const { isEmpty, count } = useListState(listAtom);

    if (typeof children === "function") {
      return children({ isEmpty, count });
    }

    return isEmpty ? children : null;
  }

  return { Empty };
}
