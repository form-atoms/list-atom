import { StoryObj } from "@storybook/react";
import {
  FieldAtom,
  type FormFieldValues,
  type FormFields,
  InputField,
  fieldAtom,
  useFieldActions,
} from "form-atoms";

import { AddButtonProps, List, ListProps, RemoveButtonProps } from "./List";
import { listAtom } from "../../atoms";
import { PicoFieldName } from "../../story/PicoFieldName";
import { StoryForm } from "../../story/StoryForm";

const RemoveButton = ({ remove }: RemoveButtonProps) => (
  <button type="button" className="outline secondary" onClick={remove}>
    Remove
  </button>
);

const AddButton = ({ add }: AddButtonProps) => (
  <button type="button" className="outline" onClick={() => add()}>
    Add item
  </button>
);

const meta = {
  component: List,
  args: {
    AddButton,
    RemoveButton,
  },
};

export default meta;

const AddHobbyButton = ({
  add,
}: AddButtonProps<{ hobby: FieldAtom<string> }>) => (
  <button type="button" className="outline" onClick={() => add()}>
    Add hobby
  </button>
);

const listStory = <Fields extends FormFields>(
  storyObj: {
    args: ListProps<Fields, FormFieldValues<Fields>>;
  } & Omit<StoryObj<typeof meta>, "args">,
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
    children: ({ fields, RemoveButton }) => (
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
            render={(props) => <input {...props} placeholder="Variable Name" />}
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
          <RemoveButton />
        </div>
      </div>
    ),
  },
});

export const CustomAddButton = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "The `AddButton` render prop allows not only to render a custom button. It also enables you to supply custom `FormFields` object to the `add` action. This is useful when you want to create a customized list item (e.g. with initial value).",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "productFeatures",
      value: [{ feature: "quality materials" }, { feature: "solid build" }],
      fields: ({ feature }) => ({ feature: fieldAtom({ value: feature }) }),
    }),
    AddButton: ({ add }: AddButtonProps<{ feature: FieldAtom<string> }>) => (
      <button
        type="button"
        className="outline"
        onClick={() =>
          add({ feature: fieldAtom({ value: "beautiful colors" }) })
        }
      >
        Add initialized item
      </button>
    ),
    children: ({ fields, RemoveButton }) => (
      <fieldset role="group">
        <InputField atom={fields.feature} component="input" />
        <RemoveButton />
      </fieldset>
    ),
  },
});

export const EmptyRenderProp = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "Provide `Empty` render prop, to render a blank slate when the list is empty.",
      },
    },
  },
  args: {
    atom: listAtom({
      value: [{ hobby: "gardening" }],
      fields: ({ hobby }) => ({ hobby: fieldAtom<string>({ value: hobby }) }),
    }),
    AddButton: AddHobbyButton,
    Empty: () => (
      <article>
        <p style={{ textAlign: "center" }}>
          You don't have any hobbies in your list. Start by adding your first
          one.
        </p>
      </article>
    ),
    children: ({ fields, RemoveButton }) => (
      <fieldset role="group">
        <InputField atom={fields.hobby} component="input" />
        <RemoveButton />
      </fieldset>
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
    AddButton: AddHobbyButton,
    children: ({ fields, RemoveButton, add, item }) => (
      <div
        style={{
          display: "grid",
          gridGap: 16,
          gridTemplateColumns: "auto min-content min-content",
        }}
      >
        <InputField atom={fields.hobby} component="input" />
        <button type="button" className="outline" onClick={() => add(item)}>
          Prepend
        </button>
        <RemoveButton />
      </div>
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
    initialValue: [
      { hobby: "coding" },
      { hobby: "gardening" },
      { hobby: "mountain bike" },
    ],
    atom: listAtom({
      name: "hobbies",
      value: [{ hobby: "gardening" }],
      fields: ({ hobby }) => ({ hobby: fieldAtom<string>({ value: hobby }) }),
    }),
    AddButton: AddHobbyButton,
    children: ({ fields, moveUp, moveDown, RemoveButton }) => (
      <fieldset role="group">
        <InputField atom={fields.hobby} component="input" />
        <button type="button" className="outline" onClick={moveUp}>
          Up
        </button>
        <button type="button" className="outline" onClick={moveDown}>
          Down
        </button>
        <RemoveButton />
      </fieldset>
    ),
  },
});

export const NestedList = listStory({
  parameters: {
    docs: {
      description: {
        story:
          "Since the `listAtom()` supports nesting, we can render `<List />` within `<List />`. As an example we capture multiple people with multiple banking accounts:",
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
    AddButton: ({ add }) => (
      <button type="button" className="outline" onClick={() => add()}>
        Add Person
      </button>
    ),
    children: ({ fields, index, remove }) => (
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
              render={(props) => <input {...props} placeholder="Last Name" />}
            />
          </div>
        </div>
        <List
          atom={fields.accounts}
          AddButton={({ add }) => (
            <button type="button" className="outline" onClick={() => add()}>
              Add Bank Account
            </button>
          )}
          RemoveButton={RemoveButton}
        >
          {({ fields, index, RemoveButton: RemoveIban }) => (
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
                  render={(props) => <input {...props} placeholder="IBAN" />}
                />
                <RemoveIban />
              </div>
            </>
          )}
        </List>
      </article>
    ),
  },
});

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
    children: ({ fields, RemoveButton }) => (
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
            render={(props) => <input {...props} placeholder="Variable Name" />}
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
          <RemoveButton />
        </div>
      </div>
    ),
  },
  render: (props) => {
    const actions = useFieldActions(props.atom);

    return (
      <>
        <List
          {...props}
          AddButton={({ add }) => (
            <section className="grid">
              <button type="button" className="outline" onClick={() => add()}>
                New variable
              </button>
              <div />
              <button
                type="button"
                className="outline secondary"
                onClick={() => actions.setValue([])}
              >
                Clear
              </button>
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
            </section>
          )}
        />
      </>
    );
  },
});
