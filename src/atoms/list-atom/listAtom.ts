import type {
  FieldAtomConfig,
  FormFieldValues,
  FormFields,
  Validate,
  ValidateOn,
  ValidateStatus,
} from "form-atoms";
import { walkFields } from "form-atoms";
import type {
  Atom,
  Getter,
  PrimitiveAtom,
  SetStateAction,
  WritableAtom,
} from "jotai";
import { atom } from "jotai";
import { RESET, atomWithDefault, atomWithReset, splitAtom } from "jotai/utils";

import { type ListItemForm, listItemForm } from "./listItemForm";
import type { FieldAtomState } from "../types";

export type SplitListItem<Fields extends FormFields> = PrimitiveAtom<
  ListItemForm<Fields>
>;

// copied from jotai/utils
type SplitAtomAction<Item> =
  | {
      type: "remove";
      atom: PrimitiveAtom<Item>;
    }
  | {
      type: "insert";
      value: Item;
      before?: PrimitiveAtom<Item>;
    }
  | {
      type: "move";
      atom: PrimitiveAtom<Item>;
      before?: PrimitiveAtom<Item>;
    };

type ListAtomState<Fields extends FormFields> = FieldAtomState<
  FormFieldValues<Fields>[]
> & {
  /**
   * An atom indicating whether the list is empty.
   */
  empty: Atom<boolean>;
  /**
   * A splitAtom() instance from jotai/utils.
   * It handles adding, removing and moving of items in the list.
   * @internal
   */
  _splitList: WritableAtom<
    SplitListItem<Fields>[],
    [SplitAtomAction<ListItemForm<Fields>>],
    void
  >;
  /**
   * An atom holding the list of forms of each item.
   * @internal
   */
  _formList: WritableAtom<
    ListItemForm<Fields>[],
    [typeof RESET | SetStateAction<ListItemForm<Fields>[]>],
    void
  >;
  /**
   * An atom holding the fields of the internal formAtom of each item.
   * @internal
   */
  _formFields: Atom<Fields[]>;
  buildItem(value?: FormFieldValues<Fields>): ListItemForm<Fields>;
};

export type ListAtom<Fields extends FormFields> = Atom<ListAtomState<Fields>>;

export type ListAtomConfig<Fields extends FormFields> = {
  /**
   * A function to initialize the fields for each of the initial values.
   */
  fields: () => Fields;
  /**
   * Error message the listAtom will have, when its items have nested errors.
   * It will be one of errors returned by the `useFieldErrors()` hook.
   */
  invalidItemError?: string;
} & Partial<
  Pick<
    FieldAtomConfig<FormFieldValues<Fields>[]>,
    "value" | "name" | "validate"
  >
>;

export function listAtom<Fields extends FormFields>({
  fields,
  value = [],
  ...config
}: ListAtomConfig<Fields>): ListAtom<Fields> {
  type Value = FormFieldValues<Fields>;

  const nameAtom = atomWithReset(config.name);
  const initialValueAtom = atomWithReset<Value[] | undefined>(undefined);

  /**
   * @param value The item value.
   */
  function buildItem(value: Value): ListItemForm<Fields> {
    const itemForm = listItemForm({
      value,
      fields: fields(),
      formListAtom: _formListAtom,
      getListName: (get) => get(get(self).name),
    });

    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      itemForm.debugLabel = `list/${config.name ?? self}/form/${itemForm}`;
      itemForm.debugPrivate = true;
    }

    return itemForm;
  }

  const makeFormList = (): ListItemForm<Fields>[] => value.map(buildItem);

  const _initialFormListAtom = atomWithDefault(makeFormList);
  const _formListAtom = atomWithDefault((get) => get(_initialFormListAtom));
  const _splitListAtom = splitAtom(_formListAtom);
  /**
   * Unwraps the list of formAtoms, into list of fields of each form.
   */
  const _formFieldsAtom = atom((get) => {
    const formLists = get(_formListAtom);

    return formLists.map((formAtom) => {
      return get(get(formAtom).fields);
    });
  });

  const touchedAtom = atomWithReset(false);
  const dirtyAtom = atom((get) => {
    const listUpdated = !arraysShallowEqual(
      get(_initialFormListAtom),
      get(_formListAtom),
    );

    if (listUpdated) {
      // early return
      return listUpdated;
    }

    const hasNestedDirtyField = get(_formListAtom)
      .map((formAtom) => {
        const form = get(formAtom);
        let dirty = false;

        walkFields(get(form.fields), (fieldAtom) => {
          const field = get(fieldAtom);

          if (get(field.dirty)) {
            dirty = true;
            return false;
          }
        });

        return dirty;
      })
      .some((dirty) => dirty);

    return hasNestedDirtyField;
  });
  const _listErrorsAtom = atom<string[]>([]);
  const _itemErrorsAtom = atom((get) => {
    // get errors from the nested forms
    const hasInvalidForm = get(_formListAtom)
      .map((formAtom) => {
        const form = get(formAtom);
        let invalid = false;

        walkFields(get(form.fields), (field) => {
          const atoms = get(field);
          const errors = get(atoms.errors);

          if (errors.length) {
            invalid = true;
            return false;
          }
        });

        return invalid;
      })
      .some((invalid) => invalid);

    return hasInvalidForm
      ? [config.invalidItemError ?? "Some list items contain errors."]
      : [];
  });
  const errorsAtom = atom(
    (get) => [...get(_listErrorsAtom), ...get(_itemErrorsAtom)],
    () => {
      /**
       * NOTE: Intentional NO-OP
       * The errorAtom must be writable, as the `form.validateFields` will write the errors returned from `_validateCallback`.
       * We ignore the write, as we already manage the `listErrors` internally.
       */
    },
  ) as PrimitiveAtom<string[]>;
  const validateCountAtom = atom(0);
  const validateResultAtom = atom<ValidateStatus>("valid");

  function readListValue(get: Getter) {
    return get(_formListAtom).map((formAtom) => {
      return get(get(formAtom).values);
    }) as Value[];
  }

  /**
   * The ref is practicaly not usable for list, but required to match the fieldAtom signature.
   * @internal
   */
  const refAtom = atom<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  >(null);
  const emptyAtom = atom((get) => get(_formListAtom).length === 0);
  const valueAtom = atom(
    readListValue,
    (
      get,
      set,
      value: Value[] | typeof RESET | ((prev: Value[]) => Value[]),
    ) => {
      if (value === RESET) {
        set(_formListAtom, value);
        set(_initialFormListAtom, value);

        const forms = get(_formListAtom);

        for (const form of forms) {
          const { reset } = get(form);
          set(reset);
        }
      } else {
        const update =
          typeof value === "function" ? value(readListValue(get)) : value;

        if (Array.isArray(update)) {
          const updatedFormList = update.map(buildItem);
          set(_initialFormListAtom, updatedFormList);
          set(_formListAtom, updatedFormList);
        } else {
          throw Error("Writing unsupported value to listAtom!");
        }
      }
    },
  );

  const resetAtom = atom<null, [void], void>(null, (get, set) => {
    set(errorsAtom, []);
    set(_listErrorsAtom, []);
    set(touchedAtom, RESET);
    set(valueAtom, get(initialValueAtom) ?? RESET);

    // Need to set a new pointer to prevent stale validation results
    // from being set to state after this invocation.
    set(validateCountAtom, (count) => ++count);
    set(validateResultAtom, "valid");
  });

  const validateAtom = atom<null, [] | [ValidateOn], void>(
    null,
    (get, set, event = "user") => {
      async function resolveErrors() {
        if (!event) return;
        // This pointer prevents a stale validation result from being
        // set to state after the most recent invocation of validate.
        const ptr = get(validateCountAtom) + 1;
        set(validateCountAtom, ptr);
        const dirty = get(dirtyAtom);
        const value = get(valueAtom);

        if (event === "user" || event === "submit") {
          set(touchedAtom, true);
        }

        // run validation for nested forms
        await Promise.all(
          get(_formListAtom).map((formAtom) =>
            get(formAtom)._validateFields(get, set, event),
          ),
        );

        let errors: string[] = [];

        const maybeValidatePromise = config.validate?.({
          get,
          set,
          dirty,
          touched: get(touchedAtom),
          value,
          event: event,
        });

        if (isPromise(maybeValidatePromise)) {
          if (ptr === get(validateCountAtom)) {
            set(validateResultAtom, "validating");
          }
          errors = (await maybeValidatePromise) ?? get(_listErrorsAtom);
        } else {
          errors = maybeValidatePromise ?? get(_listErrorsAtom);
        }

        if (ptr === get(validateCountAtom)) {
          set(_listErrorsAtom, errors);
          set(validateResultAtom, errors.length > 0 ? "invalid" : "valid");
        }
      }

      resolveErrors();
    },
  );

  const validateCallback: Validate<Value[]> = async (state) => {
    // run validation for nested forms
    await Promise.all(
      state
        .get(_formListAtom)
        .map((formAtom) =>
          state
            .get(formAtom)
            ._validateFields(state.get, state.set, state.event),
        ),
    );

    // validate the listAtom itself
    const listValidate = config.validate?.(state);
    const listError = isPromise(listValidate)
      ? await listValidate
      : listValidate;

    state.set(_listErrorsAtom, listError ?? []);

    return state.get(errorsAtom);
  };

  const listAtoms = {
    name: nameAtom,
    value: valueAtom,
    empty: emptyAtom,
    validateStatus: validateResultAtom,
    touched: touchedAtom,
    dirty: dirtyAtom,
    errors: errorsAtom,
    reset: resetAtom,
    validate: validateAtom,
    ref: refAtom,
    _validateCount: validateCountAtom,
    _initialValue: initialValueAtom,
    /**
     * List private atoms
     */
    _splitList: _splitListAtom,
    _formList: _formListAtom,
    _formFields: _formFieldsAtom,
  };

  const self = atom({
    ...listAtoms,
    buildItem,
    _validateCallback: validateCallback,
  });

  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    Object.entries(listAtoms).map(([atomName, atom]) => {
      atom.debugLabel = `list/${atomName}/${config.name ?? self}`;
    });

    self.debugPrivate = true;
    _splitListAtom.debugPrivate = true;
    _formListAtom.debugPrivate = true;
    _formFieldsAtom.debugPrivate = true;
    _initialFormListAtom.debugPrivate = true;
    _listErrorsAtom.debugPrivate = true;
    _itemErrorsAtom.debugPrivate = true;
  }

  return self;
}

function isPromise(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

function arraysShallowEqual(a: unknown[], b: unknown[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((v, i) => Object.is(v, b[i]))
  );
}
