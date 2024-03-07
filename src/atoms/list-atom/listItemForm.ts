import { FormAtom, FormFields, RESET, formAtom, walkFields } from "form-atoms";
import { Atom, Getter, SetStateAction, WritableAtom, atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { extendAtom } from "../extendAtom";
import { PrimitiveFormAtom } from "../types";

type FormAtomState<Fields extends FormFields> =
  FormAtom<Fields> extends Atom<infer State> ? State : never;

type NamedFormAtomState<Fields extends FormFields> = FormAtomState<Fields> & {
  nameAtom: Atom<string>;
};

type NamedFormAtom<Fields extends FormFields> = Atom<
  NamedFormAtomState<Fields>
>;

export type ListItemForm<Fields extends FormFields> = NamedFormAtom<Fields>;

type ListItemFormConfig<Fields extends FormFields> = {
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

export function listItemForm<Fields extends FormFields>({
  fields,
  formListAtom,
  getListNameAtom,
}: ListItemFormConfig<Fields>) {
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
          const { name: _originalNameAtom, ...atoms } = get(field);

          const scopedNameAtom = atom(
            (get) => {
              return [get(nameAtom), get(_originalNameAtom)]
                .filter(Boolean)
                .join(".");
            },
            (_, set, update: string) => {
              set(_originalNameAtom, update);
            },
          );

          if (
            typeof process !== "undefined" &&
            process.env.NODE_ENV !== "production"
          ) {
            scopedNameAtom.debugLabel =
              _originalNameAtom.debugLabel + "/scoped";
          }

          // @ts-expect-error field is PrimitiveAtom
          set(field, { ...atoms, name: scopedNameAtom, _originalNameAtom });
        });

        return () => {
          walkFields(fields, (field) => {
            // @ts-expect-error oh yes
            const { _originalNameAtom, ...atoms } = get(field);

            // @ts-expect-error field is PrimitiveAtom
            set(field, {
              ...atoms,
              // drop the scopedNameAtom, as to not make it original on next mount
              name: _originalNameAtom,
              _originalNameAtom: undefined,
            });
          });
        };
      });

      get(patchNamesEffect);

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
