import { useMemo } from "react";
import { useAtomValue } from "jotai";
import type { FormFields, UseAtomOptions } from "form-atoms";

import { type ListAtom } from "../../atoms";

export const useListState = <Fields extends FormFields>(
  listAtom: ListAtom<Fields>,
  options?: UseAtomOptions,
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
