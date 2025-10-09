import { InputField, fieldAtom } from "form-atoms";

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
      value: [],
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
                render={(props) => <input autoFocus {...props} />}
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
