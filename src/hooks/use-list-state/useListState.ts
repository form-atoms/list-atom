import type { FormFields, UseAtomOptions } from "form-atoms";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

import type { ListAtom } from "../../atoms";

export const useListState = <Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
  options?: UseAtomOptions,
) => {
  const atoms = useAtomValue(listAtom, options);
  const items = useAtomValue(atoms._splitList, options);
  const formList = useAtomValue(atoms._formList, options);
  const formFields = useAtomValue(atoms._formFields, options);
  const isEmpty = useAtomValue(atoms.empty, options);
  const count = useAtomValue(atoms.count, options);
  const isFull = useAtomValue(atoms.full, options);
  const max = useAtomValue(atoms.max, options);

  return useMemo(
    () => ({ items, formList, formFields, isEmpty, count, isFull, max }),
    [items, formList, formFields, isEmpty, count, isFull, max],
  );
};
