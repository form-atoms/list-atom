import { type FormFields, RESET, formAtom, walkFields } from "form-atoms";
import type { Atom, Getter, SetStateAction, WritableAtom } from "jotai";
import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { extendAtom } from "../extendAtom";
import type { FormAtomState, PrimitiveFormAtom } from "../types";

type NamedFormAtomState<Fields extends FormFields> = FormAtomState<Fields> & {
  /**
   * The name atom of the form, which is automatically scoped by list index.
   * @example the 2nd item in a list named "users" will have name "users[1]".
   */
  name: Atom<string>;
};

type NamedFormAtom<Fields extends FormFields> = Atom<
  NamedFormAtomState<Fields>
>;

export type ListItemForm<Fields extends FormFields> = NamedFormAtom<Fields>;

type ListItemFormConfig<Fields extends FormFields, Value> = {
  /**
   * The item value to initialize the fields.
   * Value is optional, e.g. when calling actions.add(), often we want a blank field.
   */
  value?: Value; // perf hack, no need to have the FormFieldValues<Fields> inference here
  /**
   * The fields of the item form.
   */
  fields: Fields;
  /**
   * The atom where this list item will be stored.
   */
  formListAtom: WritableAtom<
    ListItemForm<Fields>[],
    [typeof RESET | SetStateAction<ListItemForm<Fields>[]>],
    void
  >;
  /**
   * The nameAtom of the parent listAtom.
   */
  getListNameAtom: (
    get: Getter,
  ) =>
    | Atom<string>
    | WritableAtom<
        string | undefined,
        [string | undefined | typeof RESET],
        void
      >;
};

export function listItemForm<Fields extends FormFields, Value>({
  value,
  fields,
  formListAtom,
  getListNameAtom,
}: ListItemFormConfig<Fields, Value>) {
  const itemFormAtom: ListItemForm<Fields> = extendAtom(
    formAtom(fields) as unknown as PrimitiveFormAtom<Fields>,
    (base, get) => {
      const nameAtom = atom((get) => {
        const list: ListItemForm<Fields>[] = get(formListAtom);
        const listName = get(getListNameAtom(get));

        return `${listName ?? ""}[${list.indexOf(itemFormAtom)}]`;
      });

      const patchNamesEffect = atomEffect((get, set) => {
        const fields = get(base.fields);

        walkFields(fields, (field) => {
          const { name: _name, ...atoms } = get(field);

          const scopedNameAtom = atom((get) =>
            [get(nameAtom), get(_name)].filter(Boolean).join("."),
          );

          if (
            typeof process !== "undefined" &&
            process.env.NODE_ENV !== "production"
          ) {
            scopedNameAtom.debugLabel = _name.debugLabel + "/scoped";
          }

          // @ts-expect-error field is typed as PrimitiveAtom, but is writable
          set(field, { ...atoms, name: scopedNameAtom, _name });
        });

        return () => {
          walkFields(fields, (field) => {
            // @ts-expect-error oh yes
            const { _name, ...atoms } = get(field);

            // @ts-expect-error field is PrimitiveAtom
            set(field, {
              ...atoms,
              // drop the scopedNameAtom, as to not make it original on next mount
              name: _name,
              _name: undefined,
            });
          });
        };
      });

      // NOTE: patchNames, for an unkonwn reason, must be mounted before the initializeItem, otherwise there is infinite loop in test.
      get(patchNamesEffect);

      const initializeItemEffect = atomEffect((get, set) => {
        if (!value) {
          return;
        }
        const fields = get(base.fields);

        walkFields(fields, (field, path) => {
          const atoms = get(field);

          const val = [...path].reduce(
            (source, key) =>
              typeof source === "object" && key in source
                ? // @ts-expect-error fine
                  source[key]
                : undefined,
            value,
          );

          if (val) {
            set(atoms._initialValue, val);
            set(atoms.value, val);
          }
        });
      });

      if (value) {
        get(initializeItemEffect);
      }

      if (
        typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production"
      ) {
        patchNamesEffect.debugPrivate = true;
        nameAtom.debugPrivate = true;
      }

      return {
        name: nameAtom,
      };
    },
  );

  return itemFormAtom;
}
