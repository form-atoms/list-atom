import { FieldAtom, FormAtom, FormFields } from "form-atoms";
import { Atom, PrimitiveAtom } from "jotai";

export type ExtendFieldAtom<Value, State> =
  FieldAtom<Value> extends Atom<infer DefaultState>
    ? Atom<DefaultState & State>
    : never;

export type PrimitiveFormAtom<Fields extends FormFields> =
  FormAtom<Fields> extends Atom<infer DefaultState>
    ? PrimitiveAtom<DefaultState>
    : never;
