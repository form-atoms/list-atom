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
  /**
   * Indicates whether the list has reached its maximum capacity.
   */
  isFull: boolean;
  /**
   * The maximum number of items allowed in the list.
   */
  max: number;
};

export type EmptyProps = {
  children?: ReactNode | ((props: EmptyChildrenProps) => ReactNode);
};

export function createEmpty<Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
) {
  function Empty({ children }: EmptyProps) {
    const { isEmpty, count, isFull, max } = useListState(listAtom);

    if (typeof children === "function") {
      return children({ isEmpty, count, isFull, max });
    }

    return isEmpty ? children : null;
  }

  return { Empty };
}
