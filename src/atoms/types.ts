import { FieldAtom, FormAtom, FormFields } from "form-atoms";
import { Atom, PrimitiveAtom } from "jotai";

export type ExtendFieldAtom<Value, State> =
  FieldAtom<Value> extends Atom<infer DefaultState>
    ? PrimitiveAtom<DefaultState & State> // fieldAtom is in practice writable - PrimitiveAtom
    : never;

export type PrimitiveFormAtom<Fields extends FormFields> =
  FormAtom<Fields> extends Atom<infer DefaultState>
    ? PrimitiveAtom<DefaultState>
    : never;
