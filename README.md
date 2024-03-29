<div align="center">
  <img height="300" style="margin: 32px" src="./public/form-atoms-banner-transparent.png#gh-dark-mode-only">
  <img width="180" style="margin: 32px" src="./public/form-atoms-field.svg#gh-light-mode-only">
  <h1>list-atom extension for the <a href="https://github.com/form-atoms/form-atoms" target="_blank">form-atoms</a></h1>
</div>

```sh
npm install jotai-effect @form-atoms/list-atom
```

<a aria-label="Minzipped size" href="https://bundlephobia.com/result?p=%40form-atoms/list-atom">
  <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/%40form-atoms/list-atom?style=for-the-badge&labelColor=24292e">
</a>
<a aria-label="NPM version" href="https://www.npmjs.com/package/%40form-atoms/list-atom">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40form-atoms/list-atom?style=for-the-badge&labelColor=24292e">
</a>
<a aria-label="Code coverage report" href="https://codecov.io/gh/form-atoms/list-atom">
  <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/form-atoms/list-atom?style=for-the-badge&labelColor=24292e">
</a>

### Quick start

```tsx
import { fromAtom, useForm, fieldAtom, InputField } from "form-atoms";
import { listAtom, List } from "@form-atoms/list-atom";

const environmentVariables = listAtom({
  name: "environment",
  value: [{ key: "GITHUB_SECRET", value: "<hash>" }],
  fields: ({ key, value }) => ({
    key: fieldAtom({ value: key }),
    value: fieldAtom({ value }),
  }),
});

const form = formAtom({ environmentVariables });

export const Form = () => {
  const { submit } = useForm(form);

  return (
    <form onSubmit={submit(console.log)}>
      <List atom={environmentVariables}>
        {({ fields }) => (
          <>
            <InputField
              atom={fields.key}
              render={(props) => (
                <>
                  <label>Variable Key</label>
                  <input {...props} />
                </>
              )}
            />
            <InputField
              atom={fields.value}
              render={(props) => (
                <>
                  <label>Variable Value</label>
                  <input {...props} />
                </>
              )}
            />
          </>
        )}
      </List>
    </form>
  );
};
```

## Table of contents

| Atoms                     | Description                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`listAtom()`](#listatom) | An atom that represents a list of form fields in a form. It manages state for the list, including the name, value, errors, dirty, validation and empty state. |

| Hooks                                 | Description                                                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`useListActions()`](#uselistactions) | A hook that returns a `add`, `remove` & `move` actions, that can be used to interact with the list atom state. |
| [`useList()`](#uselist)               | A hook that returns the list `items` ready to be rendred together with the list actions.                       |

| Components        | Description                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`<List>`](#list) | A component that render the individual items of listAtom with render props to render `AddButton`, `RemoveButton` and/or `Empty` slate. |

## List atoms

### listAtom()

An atom that represents a **list of form fields** in a form. It manages state for the list, including the name, value, errors, dirty, validation and empty state.

#### Arguments

| Name   | Type                                               | Required? | Description                                       |
| ------ | -------------------------------------------------- | --------- | ------------------------------------------------- |
| config | [`ListAtomConfig<Fields, Value>`](#ListAtomConfig) | Yes       | The initial state and configuration of the field. |

#### `ListAtomConfig`

```ts
export type ListAtomConfig<Fields extends FormFields, Value> = {
  /**
   * Optionally provide a name for the field that will be added
   * prefixed to inner fields
   * E.g. list name "contacts" and field name "email"
   * will have scoped name for the 4th item "contacts[3].email"
   */
  name?: string;
  /**
   * The initial array of values of the list
   */
  value: Value[];
  /**
   * A function to initialize the fields for each of the initial values.
   */
  fields: (value: Value) => Fields;
  /**
   * Error message the listAtom will have, when its items have nested errors.
   * It will be one of errors returned by the `useFieldErrors()` hook.
   */
  invalidItemError?: string;
  /**
   * A function that validates the value of the field any time
   * one of its atoms changes. It must either return an array of
   * string error messages or undefined. If it returns undefined,
   * the validation is "skipped" and the current errors in state
   * are retained.
   */
  validate?: (state: {
    /**
     * A Jotai getter that can read other atoms
     */
    get: Getter;
    /**
     * The current value of the field
     */
    value: Value;
    /**
     * The dirty state of the field
     */
    dirty: boolean;
    /**
     * The touched state of the field
     */
    touched: boolean;
    /**
     * The event that caused the validation. Either:
     *
     * - `"change"` - The value of the field has changed
     * - `"touch"` - The field has been touched
     * - `"blur"` - The field has been blurred
     * - `"submit"` - The form has been submitted
     * - `"user"` - A user/developer has triggered the validation
     */
    event: ValidateOn;
  }) => void | string[] | Promise<void | string[]>;
};
```

#### Returns

An extended `FieldAtom`:

```ts
export type ListAtom<Fields extends FormFields, Value> = ExtendFieldAtom<
  Value[],
  {
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
      PrimitiveAtom<ListItemForm<Fields>>[],
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
    buildItem(): ListItemForm<Fields>;
  }
>;
```

#### [⇗ Back to top](#table-of-contents)

## Hooks

### useListActions()

A hook that returns a `add`, `remove` & `move` actions, that can be used to interact with the list atom state.

#### Arguments

| Name     | Type                                         | Required? | Description                                                                         |
| -------- | -------------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| listAtom | `ListAtom<Fields extends FormFields, Value>` | Yes       | The atom that stores the list's state                                               |
| options  | `UseAtomOptions`                             | No        | Options that are forwarded to the `useAtom`, `useAtomValue`, and `useSetAtom` hooks |

#### Returns

```ts
export type UseListActions<Fields extends FormFields> = {
  /**
   * Removes the item from the list.
   *
   * @param item - An item from the listAtom's splitList array.
   */
  remove: (item: ListItem<Fields>) => void;
  /**
   * Appends a new item to the list by default, when no 'before' position is used.
   * Optionally the item can be initialized, with the 'fields' argument.
   *
   * @param before - An item from the listAtom's splitList array.
   * @param fields - A custom initialized fieldAtoms matching the Fields shape of the list.
   */
  add: (
    before?: ListItem<Fields> | undefined,
    fields?: Fields | undefined,
  ) => void;
  /**
   * Moves the item to the end of the list, or where specified when the 'before' is defined.
   *
   * @param item - A splitList item to be moved.
   * @param before - A splitList item before which to place the moved item.
   */
  move: (item: ListItem<Fields>, before?: ListItem<Fields> | undefined) => void;
};
```

#### [⇗ Back to top](#table-of-contents)

### useList()

A hook that returns the list `items` ready to be rendred together with the list actions.

#### Arguments

| Name     | Type                                         | Required? | Description                                                                         |
| -------- | -------------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| listAtom | `ListAtom<Fields extends FormFields, Value>` | Yes       | The atom that stores the list's state                                               |
| options  | `UseAtomOptions`                             | No        | Options that are forwarded to the `useAtom`, `useAtomValue`, and `useSetAtom` hooks |

#### Returns

```ts
export type UseList<Fields extends FormFields> = UseListActions<Fields> & {
  /**
   * Resolved value from the list.empty atom.
   */
  isEmpty: boolean;
  items: {
    /**
     * The item from the internal splitList.
     */
    item: ListItem<Fields>;
    /**
     * Stable React key prop derived from atom id.
     */
    key: string;
    /**
     * The form fields of the current item.
     */
    fields: Fields;
    /**
     * A function to remove the current item from the list.
     */
    remove: () => void;
    /**
     * A helper function to move the item to the previous index in the list.
     */
    moveUp: () => void;
    /**
     * A helper function to move the item to the next index in the list.
     */
    moveDown: () => void;
  };
};
```

#### [⇗ Back to top](#table-of-contents)

## Components

### &lt;List&gt;

#### Props

| Name         | Type                                                  | Required? | Description                                                               |
| ------------ | ----------------------------------------------------- | --------- | ------------------------------------------------------------------------- |
| atom         | `ListAtom<FormFields, Value>`                         | Yes       | A list atom                                                               |
| children     | `(props: ListItemProps) => JSX.Element`               | Yes       | A render prop                                                             |
| initialValue | `Value[]`                                             | No        | A value to (re)initialize the listAtom                                    |
| RemoveButton | `FunctionComponent<{remove: () => void}>`             | no        | A render prop receiving `remove` function for each individual list item   |
| AddButton    | `FunctionComponent<{add: (fields?: Fields) => void}>` | No        | A render prop to render a button adding new items to the end of the list  |
| Empty        | `FunctionComponent`                                   | No        | A render prop to render a blank slate when there are no items in the list |
| store        | `AtomStore`                                           | No        | [A Jotai store](https://jotai.org/docs/api/core#createstore)              |

#### Render Props

Your `children` render prop will receive the following props:

```ts
type ListItemProps<Fields extends FormFields> = {
  /**
   * The fields of current item, as returned from the builder function.
   */
  fields: Fields;
  /**
   * The item from the internal splitList.
   */
  item: ListItem<Fields>;
  /**
   * The index of the current item.
   */
  index: number;
  /**
   * Total count of items in the list.
   */
  count: number;
  /**
   * Append a new item to the end of the list.
   * When called with current item, it will be prepend with a new item.
   */
  add: (before?: ListItem<Fields>) => void;
  /**
   * Removes the current item.
   */
  remove: () => void;
  /**
   * Moves the current item one slot up in the list.
   * When called for the first item, the action is no-op.
   */
  moveUp: () => void;
  /**
   * Moves the current item one slot down in the list.
   * When called for the last item, the item moves to the start of the list.
   */
  moveDown: () => void;
  /**
   * A component with an onClick handler bound to remove the current item from the list.
   */
  RemoveButton: FunctionComponent;
};
```

#### [⇗ Back to top](#table-of-contents)

## Let's see what's in this listAtom

![atom in atoms](./public//atom-in-atom.png)

#### [⇗ Back to top](#table-of-contents)

## LICENSE

MIT
