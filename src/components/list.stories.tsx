import { StoryObj } from "@storybook/react-vite";
import {
  type FieldAtom,
  type FormFields,
  InputField,
  fieldAtom,
  useFieldActions,
} from "form-atoms";
import { RenderProp } from "react-render-prop-type";

import { ListAtom, listAtom } from "../atoms";
import { PicoFieldErrors } from "../story/PicoFieldErrors";
import { PicoFieldName } from "../story/PicoFieldName";
import { StoryForm } from "../story/StoryForm";
import { createList } from "./list";

const RemoveButton = ({ remove }: { remove: () => void }) => (
  <button type="button" className="outline secondary" onClick={remove}>
    Remove
  </button>
);

type ListArgs<Fields extends FormFields> = {
  atom: ListAtom<Fields, any>;
} & RenderProp<
  ReturnType<typeof createList<NoInfer<Fields>>> & {
    atom: ListAtom<Fields, any>;
  }
>;

const meta = {
  render({ atom, children }: ListArgs<FormFields>) {
    const { List } = createList(atom);

    return children({ List, atom });
  },
};

export default meta;

const listStory = <Fields extends FormFields>(
  storyObj: {
    args: ListArgs<Fields>;
  } & Omit<StoryObj, "args">,
) => ({
  ...storyObj,
  decorators: [
    (Story: () => JSX.Element) => (
      <StoryForm fields={{ field: storyObj.args.atom }}>
        {() => <Story />}
      </StoryForm>
    ),
  ],
});

export const ListOfObjects = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "Usually the List is used to capture a list of objects like addresses or environment variables:.",
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
      fields: ({ variable, value }) => ({
        variable: fieldAtom({ name: "variable", value: variable }),
        value: fieldAtom({ name: "value", value: value }),
      }),
    }),
    children: ({ List }) => (
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
                <PicoFieldName field={fields.variable} />
              </div>
              <div>
                <InputField
                  atom={fields.value}
                  render={(props) => (
                    <input {...props} placeholder="Variable Value" />
                  )}
                />
                <PicoFieldName field={fields.variable} />
              </div>
              <div>
                <RemoveButton remove={remove} />
              </div>
            </div>
          )}
        </List.Item>
        <List.Add />
      </List>
    ),
  },
});

export const CustomAddButton = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "The `<List.Add>` component allows not only to render a custom button. It also enables you to supply custom `FormFields` object to the `add` action. This is useful when you want to create a customized list item (e.g. with initial value).",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "productFeatures",
      value: [{ feature: "quality materials" }, { feature: "solid build" }],
      fields: ({ feature }) => ({ feature: fieldAtom({ value: feature }) }),
    }),
    children: ({ List }) => (
      <List>
        <List.Item>
          {({ fields, remove }) => (
            <fieldset role="group">
              <InputField atom={fields.feature} component="input" />
              <RemoveButton remove={remove} />
            </fieldset>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <button
              type="button"
              className="outline"
              onClick={() =>
                add({ feature: fieldAtom({ value: "beautiful colors" }) })
              }
            >
              Add initialized item
            </button>
          )}
        </List.Add>
      </List>
    ),
  },
});

export const PositioningAddButton = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "You can control the list from outside by the `useListActions` hook. Here we render a button with `add` action only besides the last item in the list.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "productFeatures",
      value: [{ feature: "quality materials" }, { feature: "solid build" }],
      fields: ({ feature }) => ({ feature: fieldAtom({ value: feature }) }),
    }),
    children: ({ List }) => {
      return (
        <List>
          <List.Empty>
            <article style={{ textAlign: "center" }}>
              <p>
                You don't have any items in your list. Start by adding your
                first one.
              </p>
              <List.Add>
                {({ add }) => (
                  <button className="outline" onClick={() => add()}>
                    Add
                  </button>
                )}
              </List.Add>
            </article>
          </List.Empty>
          <List.Item>
            {({ fields, index, count, remove, add }) => (
              <div
                style={{
                  display: "grid",
                  gridGap: 16,
                  gridTemplateColumns: "auto min-content min-content",
                }}
              >
                <InputField atom={fields.feature} component="input" />
                <div style={{ width: 300 }}>
                  {index + 1 === count && (
                    <fieldset role="group">
                      <button className="outline" onClick={() => add()}>
                        Add
                      </button>
                      <RemoveButton remove={remove} />
                    </fieldset>
                  )}
                </div>
              </div>
            )}
          </List.Item>
        </List>
      );
    },
  },
});

export const EmptyList = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "Use the `<List.Empty>` component, to render a blank slate when the list is empty.",
      },
    },
  },
  args: {
    atom: listAtom({
      value: [] as { hobby: string }[],
      fields: ({ hobby }) => ({ hobby: fieldAtom<string>({ value: hobby }) }),
    }),
    children: ({ List }) => (
      <List>
        <List.Empty>
          <article>
            <p style={{ textAlign: "center" }}>
              You don't have any hobbies in your list. Start by adding your
              first one.
            </p>
          </article>
        </List.Empty>
        <List.Item>
          {({ fields, remove }) => (
            <fieldset role="group">
              <InputField atom={fields.hobby} component="input" />
              <RemoveButton remove={remove} />
            </fieldset>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <button type="button" className="outline" onClick={() => add()}>
              Add hobby
            </button>
          )}
        </List.Add>
      </List>
    ),
  },
});

export const Prepend = listStory({
  parameters: {
    docs: {
      description: {
        story: "New list items can be prepended to any of the existing items.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "hobbies",
      value: [{ hobby: "gardening" }],
      fields: ({ hobby }) => ({ hobby: fieldAtom({ value: hobby }) }),
    }),
    children: ({ List }) => (
      <List
        initialValue={[
          { hobby: "swimming" },
          { hobby: "gardening" },
          { hobby: "coding" },
        ]}
      >
        <List.Item>
          {({ fields, remove, add, item }) => (
            <fieldset role="group">
              <InputField atom={fields.hobby} component="input" />
              <button
                type="button"
                className="outline"
                onClick={() => add(item)}
              >
                Prepend
              </button>
              <RemoveButton remove={remove} />
            </fieldset>
          )}
        </List.Item>
      </List>
    ),
  },
});

export const OrderingItems = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "The list items can be reordered by calling the `moveUp` and `moveDown` actions.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "hobbies",
      value: [{ hobby: "gardening" }],
      fields: ({ hobby }) => ({ hobby: fieldAtom<string>({ value: hobby }) }),
    }),
    children: ({ List }) => (
      <List
        initialValue={[
          { hobby: "coding" },
          { hobby: "gardening" },
          { hobby: "mountain bike" },
        ]}
      >
        <List.Item>
          {({ fields, moveUp, moveDown, remove }) => (
            <fieldset role="group">
              <InputField atom={fields.hobby} component="input" />
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
        <List.Add>
          {({ add }) => (
            <button type="button" className="outline" onClick={() => add()}>
              Add hobby
            </button>
          )}
        </List.Add>
      </List>
    ),
  },
});

export const NestedList = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "Since the `listAtom()` supports nesting, we can render `<List.Nested atom={} />` within `<List.Item />`. As an example we capture multiple people with multiple banking accounts:",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "users",
      value: [
        {
          name: "Jerry",
          lastName: "Park",
          accounts: [{ iban: "SK89 7500 0000 0000 1234 5671" }],
        },
      ],
      fields: ({ name, lastName, accounts = [] }) => ({
        name: fieldAtom({ value: name, name: "name" }),
        lastName: fieldAtom({ value: lastName, name: "lastName" }),
        accounts: listAtom({
          name: "accounts",
          value: accounts,
          fields: ({ iban }) => ({
            iban: fieldAtom({ value: iban, name: "iban" }),
          }),
        }),
      }),
    }),

    children: ({ List }) => (
      <List>
        <List.Item>
          {({ fields, index, remove }) => (
            <article>
              <header>
                <nav>
                  <ul>
                    <li>
                      <strong>Person #{index + 1}</strong>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <a
                        href="#"
                        role="button"
                        className="outline secondary"
                        onClick={(e) => {
                          e.preventDefault();
                          remove();
                        }}
                      >
                        Remove
                      </a>
                    </li>
                  </ul>
                </nav>
              </header>
              <div className="grid">
                <div>
                  <label>First Name</label>
                  <InputField
                    atom={fields.name}
                    render={(props) => <input {...props} placeholder="Name" />}
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <InputField
                    atom={fields.lastName}
                    render={(props) => (
                      <input {...props} placeholder="Last Name" />
                    )}
                  />
                </div>
              </div>
              <List.Nested atom={fields.accounts}>
                {({ List }) => (
                  <>
                    <List.Item>
                      {({ fields, index, remove }) => (
                        <>
                          <label>Account #{index + 1}</label>
                          <div
                            style={{
                              display: "grid",
                              gridGap: 16,
                              gridTemplateColumns: "auto min-content",
                            }}
                          >
                            <InputField
                              atom={fields.iban}
                              render={(props) => (
                                <input {...props} placeholder="IBAN" />
                              )}
                            />
                            <RemoveButton remove={remove} />
                          </div>
                        </>
                      )}
                    </List.Item>
                    <List.Add>
                      {({ add }) => (
                        <button
                          type="button"
                          className="outline"
                          onClick={() => add()}
                        >
                          Add Bank Account
                        </button>
                      )}
                    </List.Add>
                  </>
                )}
              </List.Nested>
            </article>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <button type="button" className="outline" onClick={() => add()}>
              Add Person
            </button>
          )}
        </List.Add>
      </List>
    ),
  },
});

function SetVariables({ atom }: { atom: FieldAtom<any> }) {
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

function ClearField({ atom }: { atom: FieldAtom<any> }) {
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

export const ProgrammaticallySetValue = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "The `listAtom` is a regular `fieldAtom`, so it works with the form-atoms field hooks. " +
          "Here we use the `setValue` action from the `useFieldActions()` hook to clear or initialize the list programmatically.",
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
      fields: ({ variable, value }) => ({
        variable: fieldAtom({ name: "variable", value: variable }),
        value: fieldAtom({ name: "value", value: value }),
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

export const ValidateAscendingValues = listStory({
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
      fields: ({ level }) => ({ level: fieldAtom<number>({ value: level }) }),
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
