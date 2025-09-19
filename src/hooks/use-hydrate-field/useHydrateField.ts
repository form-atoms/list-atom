import { FieldAtom, RESET, UseAtomOptions } from "form-atoms";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

// Is part of form-atoms, but not factored-out
// https://github.com/form-atoms/form-atoms/pull/70
export const useHydrateField = <Value>(
  fieldAtom: FieldAtom<Value>,
  initialValue?: Value | typeof RESET,
  options?: UseAtomOptions,
) => {
  const field = useAtomValue(fieldAtom);
  useHydrateAtoms(
    initialValue
      ? [
          [field.value, initialValue],
          [field._initialValue, initialValue],
        ]
      : ([] as any),
    options,
  );
};
