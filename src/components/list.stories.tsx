import {
  type FieldAtom,
  InputField,
  fieldAtom,
  useFieldActions,
} from "form-atoms";

import { listAtom } from "../atoms";
import { PicoFieldErrors } from "../story/PicoFieldErrors";
import { PicoFieldName } from "../story/PicoFieldName";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";

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
      value: [],
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
    atom: listAtom({
      name: "envVars",
      value: [],
      fields: () => ({
        variable: fieldAtom({ name: "variable", value: "" }),
        value: fieldAtom({ name: "value", value: "" }),
      }),
    }),
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

function SetVariables({
  atom,
}: {
  atom: FieldAtom<{ variable: string; value: string }[]>;
}) {
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

function ClearField<T>({ atom }: { atom: FieldAtom<T[]> }) {
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
