import type { FormFields, UseFieldOptions } from "form-atoms";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { type ListAtom } from "../../atoms/list-atom";

export const useListState = <Fields extends FormFields, Value>(
  listAtom: ListAtom<Fields, Value>,
  options?: UseFieldOptions<Value[]>,
) => {
  const atoms = useAtomValue(listAtom, options);
  const items = useAtomValue(atoms._splitList, options);
  const formList = useAtomValue(atoms._formList, options);
  const formFields = useAtomValue(atoms._formFields, options);
  const isEmpty = useAtomValue(atoms.empty, options);

  return useMemo(
    () => ({ items, formList, formFields, isEmpty }),
    [items, formList, formFields, isEmpty],
  );
};
