import type { FieldAtom } from "form-atoms";
import { useAtomValue } from "jotai";

function useFieldName<T>(fieldAtom: FieldAtom<T>) {
  return useAtomValue(useAtomValue(fieldAtom).name);
}

export const PicoFieldName = <T,>({ field }: { field: FieldAtom<T> }) => {
  const name = useFieldName(field);

  return (
    <small>
      My name is <code>{name}</code>
    </small>
  );
};
