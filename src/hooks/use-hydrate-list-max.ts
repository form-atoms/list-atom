import type { FormFields, UseAtomOptions } from "form-atoms";
import { useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import type { ListAtom } from "../atoms";

export function useHydrateListMax(
  listAtom: ListAtom<FormFields>,
  max?: number,
  options?: UseAtomOptions,
) {
  useHydrateAtoms([[useAtomValue(listAtom).max, max ?? Infinity]], options);
}
