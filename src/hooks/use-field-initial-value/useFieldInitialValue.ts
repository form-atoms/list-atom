import type { FieldAtom, RESET, UseAtomOptions } from "form-atoms";
import { useHydrateField } from "../use-hydrate-field";
import { useFieldInitialValue_noEqual } from "./useFieldInitialValue_noEqual";

export function useFieldInitialValue<Value>(
  fieldAtom: FieldAtom<Value>,
  initialValue?: Value | typeof RESET,
  options?: UseAtomOptions,
): void {
  useHydrateField(fieldAtom, initialValue);
  useFieldInitialValue_noEqual(fieldAtom, initialValue, options);
}
