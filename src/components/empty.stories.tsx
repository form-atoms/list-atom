import { fieldAtom, InputField } from "form-atoms";

import { listAtom } from "../atoms";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";

const meta = { render };

export default meta;

export const EmptyList = createListStory({
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
      name: "hobbies",
      fields: () => ({ hobby: fieldAtom<string>({ value: "" }) }),
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
              <InputField
                atom={fields.hobby}
                render={(props) => <input {...props} />}
              />
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

export const EmptyListRenderProp = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "When the `<List.Empty>` children is a render prop, it receives the `isEmpty` and `count` props. The render prop is called on every render, so it decides what to show for each state.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "hobbies",
      fields: () => ({ hobby: fieldAtom<string>({ value: "" }) }),
    }),
    children: ({ List }) => (
      <List>
        <List.Empty>
          {({ isEmpty, count }) => (
            <p style={{ textAlign: "center" }}>
              {isEmpty
                ? "You don't have any hobbies in your list yet."
                : `You have ${count} ${count === 1 ? "hobby" : "hobbies"} in your list.`}
            </p>
          )}
        </List.Empty>
        <List.Item>
          {({ fields, remove }) => (
            <fieldset role="group">
              <InputField
                atom={fields.hobby}
                render={(props) => <input {...props} />}
              />
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
