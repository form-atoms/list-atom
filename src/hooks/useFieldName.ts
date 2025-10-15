import { FieldAtom } from "form-atoms";
import { useAtomValue } from "jotai";

/**
 * @private
 */
export const useFieldName = <T>(fieldAtom: FieldAtom<T>) =>
  useAtomValue(useAtomValue(fieldAtom).name);
