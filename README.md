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

## Features

- 🏎️ **Performant rendering**. Each list item is rendered with a stable `key` derived from Jotai atom.
- 🎮 **Easy controls**. The `<List.Item>` provides `add`, `remove`, `moveUp` and `moveDown` actions for each item.
- 🧩 **Compound JSX Components**. Use the `<List.Add />`, or `<List.Empty />` instead of manual hooks.
- 🔑 **Scoped field `name`s**. The fields are dynamically indexed enabling serialization to `FormData`.
- 🐢 **Lists all the way down**. Render lists <sup>within lists <sup>within lists...</sup></sup> with the `<List.Nested>` alias `<ListOf>`.

## Quick start [🎨 Demo](https://form-atoms.github.io/list-atom/?path=/docs/components-docs--docs#quick-start-example)

```tsx
import { formAtom, useForm, fieldAtom, InputField } from "form-atoms";
import { listAtom, createList } from "@form-atoms/list-atom";

const envVars = listAtom({
  name: "envVars",
  value: [],
  fields: () => ({
    variable: fieldAtom({ name: "variable", value: "" }),
    value: fieldAtom({ name: "value", value: "" }),
  }),
});

const form = formAtom({ envVars });

const { List } = createList(envVars);

export const Form = () => {
  const { submit } = useForm(form);

  return (
    <form onSubmit={submit(console.log)}>
      <List
        initialValue={[
          { variable: "PACKAGE_NAME", value: "form-atoms" },
          { variable: "APP_URL", value: "https://jotai.org" },
        ]}
      >
        <List.Item>
          {({ fields, remove }) => (
            <>
              <InputField atom={fields.variable} component="input" />
              <InputField atom={fields.value} component="input" />
              <button type="button" onClick={remove}>
                Remove
              </button>
            </>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <button type="button" onClick={() => add()}>
              Add variable
            </button>
          )}
        </List.Add>
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

| Components                                    | Description                                                     | Demo                                                                                           |
| --------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`createList(listAtom)`](#createlistlistatom) | A function to create components bound to the listAtom.          |                                                                                                |
| [`<List>`](#list)                             | A component to initialize the listAtom via `initialValue` prop. | [🎨](https://form-atoms.github.io/list-atom/?path=/docs/components-list--docs#examples)        |
| [`<List.Add>`](#listadd)                      | Adds new or initialized items to the list.                      | [🎨](https://form-atoms.github.io/list-atom/?path=/docs/components-list-add--docs#examples)    |
| [`<List.Item>`](#listitem)                    | Iterate and render each of the list items.                      | [🎨](https://form-atoms.github.io/list-atom/?path=/docs/components-list-item--docs#examples)   |
| [`<List.Empty>`](#listempty)                  | Render children only when the list has no items.                | [🎨](https://form-atoms.github.io/list-atom/?path=/docs/components-list-empty--docs#examples)  |
| [`<List.Nested>`](#listempty)                 | Helper for nesting list within an `<List.Item>`.                | [🎨](https://form-atoms.github.io/list-atom/?path=/docs/components-list-nested--docs#examples) |

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
export type UseListActions<Fields extends FormFields, Value> = {
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
   * @param value - A custom list item value.
   */
  add: (
    before?: ListItem<Fields> | undefined,
    value?: Value | undefined,
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
export type UseList<Fields extends FormFields, Value> = UseListActions<
  Fields,
  Value
> & {
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

## createList(listAtom)

Create a compound List components:

```tsx
import { createList } from "@form-atoms/list-atom";

const { List } = createList(myListAtom);

// Usage:
// List.Add
// List.Empty
// List.Item
// List.Nested
```

#### Returns

```ts
export type ListComponents<Fields extends FormFields> = {
  /**
   * A component to initialize the listAtom value.
   */
  List: FunctionComponent<ListProps<FormFieldValues<Fields>>> & {
    /**
     * A component to iterate and render each of the list items.
     */
    Item: FunctionComponent<ItemProps<Fields>>;
    /**
     * A component to control adding new or initialized items to the list.
     */
    Add: FunctionComponent<AddButtonProps<Fields>>;
    /**
     * A component which renders children only when the list is empty.
     */
    Empty: FunctionComponent<EmptyProps>;
    /**
     * A component to create these ListComponents for a nested listAtom within a <List.Item>
     */
    Nested: <Fields extends FormFields>(
      props: NestedProps<Fields>,
    ) => ReactElement | null;
  };
};
```

### &lt;List&gt;

[🎨 Storybook](https://form-atoms.github.io/list-atom/?path=/docs/components-list--docs#examples)

#### Props

| Name         | Type        | Required? | Description                                                    |
| ------------ | ----------- | --------- | -------------------------------------------------------------- |
| children     | `ReactNode` | Yes       | A react nodes                                                  |
| initialValue | `Value[]`   | No        | A value to initialize the `listAtom`                           |
| store        | `AtomStore` | No        | [A Jotai store](https://jotai.org/docs/core/store#createstore) |

### &lt;List.Item&gt;

[🎨 Storybook](https://form-atoms.github.io/list-atom/?path=/docs/components-list-item--docs#examples)

#### Props

| Name     | Type                                    | Required? | Description   |
| -------- | --------------------------------------- | --------- | ------------- |
| children | `(props: ListItemProps) => JSX.Element` | Yes       | A render prop |

#### Children Props

```ts
type ListItemProps<Fields extends FormFields> = {
  /**
   * The fields of the current item, as created with the listAtom's `fields` config function.
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
   * Append a new item to the list.
   * When called with the current item, it will prepend it.
   */
  add: (before?: ListItem<Fields>, value?: FormFieldValues<Fields>) => void;
  /**
   * Removes the current item from the list.
   */
  remove: () => void;
  /**
   * Moves the current item one slot up in the list.
   * Supports carousel - the first item will become the last.
   */
  moveUp: () => void;
  /**
   * Moves the current item one slot down in the list.
   * Supports carousel - the last item will become the first.
   */
  moveDown: () => void;
};
```

### &lt;List.Add&gt;

[🎨 Storybook](https://form-atoms.github.io/list-atom/?path=/docs/components-list-add--docs#examples)

#### Props

| Name     | Type                                       | Required? | Description   |
| -------- | ------------------------------------------ | --------- | ------------- |
| children | `(props: AddChildrenProps) => JSX.Element` | No        | A render prop |

#### Children Props

```ts
type AddChildrenProps<Fields extends FormFields> = {
  /**
   * An action to append a new item to the end of the list.
   * @param fields optionaly set the items initial value.
   */
  add: (value?: FormFieldValues<Fields>) => void;
};
```

### &lt;List.Empty&gt;

[🎨 Storybook](https://form-atoms.github.io/list-atom/?path=/docs/components-list-empty--docs#examples)

#### Props

| Name     | Type        | Required? | Description                              |
| -------- | ----------- | --------- | ---------------------------------------- |
| children | `ReactNode` | No        | Content to render when the list is empty |

### &lt;List.Nested&gt;

[🎨 Storybook](https://form-atoms.github.io/list-atom/?path=/docs/components-list-nested--docs#examples)

#### Props

| Name     | Type                                 | Required? | Description                                                        |
| -------- | ------------------------------------ | --------- | ------------------------------------------------------------------ |
| atom     | `ListAtom<Fields>`                   | Yes       | A listAtom for which to create nested compound components          |
| children | `(props: Components) => JSX.Element` | Yes       | A render prop with a List compound component bound to the listAtom |

#### [⇗ Back to top](#table-of-contents)

## Let's see what's in this listAtom

![atom in atoms](./public//atom-in-atom.png)

#### [⇗ Back to top](#table-of-contents)

## LICENSE

MIT
