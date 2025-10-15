import type { FieldAtom } from "form-atoms";
import { useAtomValue } from "jotai";

import { useFieldName } from "../hooks/useFieldName";

export const PicoFieldName = <T,>({ field }: { field: FieldAtom<T> }) => {
  const name = useFieldName(field);

  return (
    <small>
      My name is <code>{name}</code>
    </small>
  );
};
