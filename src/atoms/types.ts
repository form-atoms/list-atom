import type { FieldAtom, FormAtom, FormFields } from "form-atoms";
import type { Atom, PrimitiveAtom } from "jotai";

export type FormAtomState<Fields extends FormFields> =
  FormAtom<Fields> extends Atom<infer State> ? State : never;

export type FieldAtomState<Value> =
  FieldAtom<Value> extends Atom<infer State> ? State : never;

export type ExtendFieldAtom<Value, State> =
  FieldAtom<Value> extends Atom<infer DefaultState>
    ? Atom<DefaultState & State>
    : never;

export type PrimitiveFormAtom<Fields extends FormFields> =
  FormAtom<Fields> extends Atom<infer DefaultState>
    ? PrimitiveAtom<DefaultState>
    : never;
