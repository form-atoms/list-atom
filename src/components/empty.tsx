import type { PropsWithChildren } from "react";
import type { FormFields } from "form-atoms";
import type { ListAtom } from "../atoms";

import { useListState } from "../hooks/use-list-state";

export type EmptyProps = PropsWithChildren;

export function createEmpty<Fields extends FormFields>(
  listAtom: ListAtom<Fields, any>,
) {
  function Empty({ children }: EmptyProps) {
    const { isEmpty } = useListState(listAtom);

    return isEmpty ? <>{children}</> : null;
  }

  return { Empty };
}
