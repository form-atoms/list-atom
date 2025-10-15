import { Getter, PrimitiveAtom, atom } from "jotai";

export const extendAtom = <
  T extends Record<string, unknown>,
  E extends Record<string, unknown>,
>(
  baseAtom: PrimitiveAtom<T>,
  makeAtoms: (cfg: T, get: Getter) => E,
) => {
  const extended = atom(
    (get) => {
      const base = get(baseAtom);
      return {
        ...base,
        ...makeAtoms(base, get),
      };
    },
    (get, set, update: T) => {
      set(baseAtom, { ...get(baseAtom), ...update });
    },
  );

  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    baseAtom.debugPrivate = true;
    extended.debugLabel = baseAtom.debugLabel;
  }

  return extended;
};
