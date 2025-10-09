import { FieldAtom, RESET, UseAtomOptions } from "form-atoms";

import { useFieldInitialValue_noEqual } from "./useFieldInitialValue_noEqual";
import { useHydrateField } from "../use-hydrate-field";

export function useFieldInitialValue<Value>(
  fieldAtom: FieldAtom<Value>,
  initialValue?: Value | typeof RESET,
  options?: UseAtomOptions,
): void {
  useHydrateField(fieldAtom, initialValue);
  useFieldInitialValue_noEqual(fieldAtom, initialValue, options);
}
