import { useCallback, useEffect } from "react";
import { useAtomCallback } from "jotai/utils";
import { atom, useSetAtom } from "jotai";
import {
  type FieldAtom,
  InputField,
  fieldAtom,
  useFieldActions,
  useFieldValue,
} from "form-atoms";

import { ListAtom, listAtom, ListItem } from "../atoms";
import { PicoFieldErrors } from "../story/PicoFieldErrors";
import { PicoFieldName } from "../story/PicoFieldName";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";
import { useListState } from "../hooks/use-list-state";

const meta = { render };

export default meta;

export const Initialized = createListStory({
  parameters: {
    docs: {
      description: {
        story: "Use the `initialValue` prop to hydrate the listAtom value:",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "environment",
      fields: () => ({
        variable: fieldAtom({ value: "" }),
        value: fieldAtom({ value: "" }),
      }),
    }),
    children: ({ List }) => (
      <List
        initialValue={[
          { variable: "NPM_TOKEN", value: "<secret>" },
          { variable: "APP_URL", value: "https://jotai.org" },
        ]}
      >
        <List.Item>
          {({ fields }) => (
            <fieldset role="group">
              <InputField atom={fields.variable} component="input" />
              <InputField atom={fields.value} component="input" />
            </fieldset>
          )}
        </List.Item>
      </List>
    ),
  },
});

export const PlainObjects = createListStory({
  parameters: {
    docs: {
      description: {
        story: "Use the `initialValue` prop to hydrate the listAtom value:",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "attractions",
      fields: () => ({
        location: {
          lat: fieldAtom({ name: "lat", value: 0 }),
          lng: fieldAtom({ name: "lng", value: 0 }),
        },
      }),
    }),
    children: ({ List }) => (
      <List initialValue={[{ location: { lat: 7, lng: 11 } }]}>
        <List.Item>
          {({ fields }) => (
            <fieldset role="group">
              <InputField atom={fields.location.lat} component="input" />
              <InputField atom={fields.location.lng} component="input" />
            </fieldset>
          )}
        </List.Item>
      </List>
    ),
  },
});

const envVars = listAtom({
  name: "envVars",
  fields: () => ({
    variable: fieldAtom({ name: "variable", value: "" }),
    value: fieldAtom({ name: "value", value: "" }),
  }),
});

export const QuickStartExample = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "Usually the List is used to capture a list of objects like addresses or environment variables:",
      },
    },
  },
  args: {
    atom: envVars,
    children: ({ List }) => (
      <List
        initialValue={[
          { variable: "PACKAGE_NAME", value: "form-atoms" },
          { variable: "APP_URL", value: "https://jotai.org" },
        ]}
      >
        <List.Item>
          {({ fields, remove }) => (
            <div
              style={{
                display: "grid",
                gridGap: 16,
                gridTemplateColumns: "auto auto min-content",
              }}
            >
              <div>
                <InputField
                  atom={fields.variable}
                  render={(props) => (
                    <input {...props} placeholder="Variable Name" />
                  )}
                />
                <PicoFieldName field={fields.variable} />
              </div>
              <div>
                <InputField
                  atom={fields.value}
                  render={(props) => (
                    <input {...props} placeholder="Variable Value" />
                  )}
                />
                <PicoFieldName field={fields.value} />
              </div>
              <div>
                <RemoveButton remove={remove} />
              </div>
            </div>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <button type="button" className="outline" onClick={() => add()}>
              Add variable
            </button>
          )}
        </List.Add>
      </List>
    ),
  },
});

function SetVariables({ atom }: { atom: typeof envVars }) {
  const actions = useFieldActions(atom);

  return (
    <button
      type="button"
      className="outline contrast"
      onClick={() =>
        actions.setValue([
          { variable: "NPM_TOKEN", value: "secrettoken" },
          { variable: "NODE_ENV", value: "production" },
        ])
      }
    >
      Set values from .env file
    </button>
  );
}

function ClearField<T>({ atom }: { atom: typeof envVars }) {
  const actions = useFieldActions(atom);

  return (
    <button
      type="button"
      className="outline secondary"
      onClick={() => actions.setValue([])}
    >
      Clear
    </button>
  );
}

export const ProgrammaticallySetValue = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "The `listAtom` is a regular `fieldAtom`, so it works with the form-atoms field hooks. " +
          "Here we use the `setValue` action from the [useFieldActions()](https://github.com/form-atoms/form-atoms#usefieldactions) hook to clear or initialize the list programmatically.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "environment",
      value: [
        { variable: "GITHUB_TOKEN", value: "<secret>" },
        { variable: "NPM_TOKEN", value: "<secret>" },
      ],
      fields: () => ({
        variable: fieldAtom({ name: "variable", value: "" }),
        value: fieldAtom({ name: "value", value: "" }),
      }),
    }),
    children: ({ List, atom }) => (
      <List>
        <List.Item>
          {({ fields, remove }) => (
            <div
              style={{
                display: "grid",
                gridGap: 16,
                gridTemplateColumns: "auto auto min-content",
              }}
            >
              <div>
                <InputField
                  atom={fields.variable}
                  render={(props) => (
                    <input {...props} placeholder="Variable Name" />
                  )}
                />
              </div>
              <div>
                <InputField
                  atom={fields.value}
                  render={(props) => (
                    <input {...props} placeholder="Variable Value" />
                  )}
                />
              </div>
              <div>
                <RemoveButton remove={remove} />
              </div>
            </div>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <section className="grid">
              <button type="button" className="outline" onClick={() => add()}>
                New variable
              </button>
              <div />
              <ClearField atom={atom} />
              <SetVariables atom={atom} />
            </section>
          )}
        </List.Add>
      </List>
    ),
  },
});

export const ValidateAscendingValues = createListStory({
  parameters: {
    docs: {
      description: {
        story: "",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "levels",
      value: [{ level: 0 }],
      fields: () => ({ level: fieldAtom<number>({ value: 0 }) }),
      validate: ({ value }) => {
        const errors: string[] = [];

        if (1 < value.length) {
          let [current] = value;

          value.forEach((value, index) => {
            if (index === 0) {
              return;
            }

            if (value.level <= current!.level) {
              errors.push(
                `Level at index ${index} must greater than the previous.`,
              );
            }

            current = value;
          });
        }

        return errors;
      },
    }),
    children: ({ List, atom }) => (
      <List initialValue={[{ level: 10 }, { level: 30 }, { level: 20 }]}>
        <List.Item>
          {({ fields, moveUp, moveDown, remove }) => (
            <fieldset role="group">
              <InputField atom={fields.level} component="input" type="number" />
              <button type="button" className="outline" onClick={moveUp}>
                Up
              </button>
              <button type="button" className="outline" onClick={moveDown}>
                Down
              </button>
              <RemoveButton remove={remove} />
            </fieldset>
          )}
        </List.Item>
        <PicoFieldErrors atom={atom} />
      </List>
    ),
  },
});

/**
 * A reference to the primary 2FA item from the list.
 */
const primary2FA = atom<FieldAtom<string> | null>(null);

const phones = listAtom({
  name: "phones",
  validate: ({ value }) => {
    const hasPrimary = value.some((item) => item.isPrimary);

    if (!hasPrimary && value.length > 0) {
      return ["Please select a primary 2FA method."];
    }

    return [];
  },
  fields: () => {
    const phone = fieldAtom<string>({ value: "" });

    return {
      phone,
      isPrimary: fieldAtom<boolean>({
        /**
         * The initial value is false by default.
         * So when there is no primary2FA choosen, all items will have isPrimary=false, to prompt the user to select one.
         */
        value: false,
        preprocess: (value, get) => {
          const primaryPhone = get(primary2FA);

          if (!primaryPhone) {
            // The form is being initialized, so use the initialValue
            return value;
          }

          /**
           * when the primary item is selected, the isPrimary will be computed
           * by comparing the current phone with the primary2FA reference.
           */
          return primaryPhone === phone;
        },
      }),
    };
  },
});

export const WithComputedField = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "Here the `isPrimary` is not a controlled input, but a computed field. It has derived value based on the `primary2FA` reference atom.",
      },
    },
  },
  args: {
    atom: phones,
    children: ({ List, atom }) => (
      <List
        initialValue={[
          { phone: "+420 123 456 789", isPrimary: true },
          { phone: "+421 987 654 321", isPrimary: false },
          { phone: "+421 999 333 777", isPrimary: false },
        ]}
      >
        <List.Item>
          {({ fields, remove }) => (
            <article>
              <fieldset role="group">
                <InputField atom={fields.phone} component="input" type="tel" />
                <RemoveButton remove={remove} />
              </fieldset>
              <PrimaryRadio {...fields} />
            </article>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => {
            const { isEmpty } = useListState(phones);
            const { validate } = useFieldActions(phones);

            const setFirstAsPrimary = useAtomCallback(
              useCallback((get, set, form: ListItem<typeof phones>) => {
                const fields = get(get(form).fields);

                set(primary2FA, fields.phone);
              }, []),
            );

            return (
              <button
                type="button"
                className="outline"
                onClick={() => {
                  const form = add();
                  if (isEmpty) {
                    setFirstAsPrimary(form);
                    validate();
                  }
                }}
              >
                Add 2FA method
              </button>
            );
          }}
        </List.Add>
        <List.Empty>
          <ClearPrimaryPhone />
        </List.Empty>
        <PicoFieldErrors atom={atom} />
      </List>
    ),
  },
});

type ListFields<T> = T extends ListAtom<infer Fields> ? Fields : never;

function PrimaryRadio({ phone, isPrimary }: ListFields<typeof phones>) {
  /**
   * The field is computed, and we treat it as read-only.
   */
  const checked = useFieldValue(isPrimary);
  const setPrimary = useSetAtom(primary2FA);
  /**
   * We need to validate the list when the primary item is changed.
   * Otherwise the list might stay in an invalid state.
   */
  const { validate } = useFieldActions(phones);

  return (
    <label>
      <input
        type="radio"
        name="primary2FA"
        checked={checked}
        onChange={() => {
          setPrimary(phone);
          validate();
        }}
      />
      This is my primary 2FA method
    </label>
  );
}

/**
 * When items are removed from the list, we need to clear the primary2FA reference.
 */
function ClearPrimaryPhone() {
  const setPrimary = useSetAtom(primary2FA);

  useEffect(() => {
    console.log("Clearing primary 2FA reference");
    setPrimary(null);
  }, [setPrimary]);

  return null;
}
