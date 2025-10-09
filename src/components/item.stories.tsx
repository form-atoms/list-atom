import { InputField, fieldAtom } from "form-atoms";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";

import { listAtom } from "../atoms";

const meta = { render };

export default meta;

export const Prepend = createListStory({
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
      fields: () => ({ hobby: fieldAtom({ value: "" }) }),
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

export const OrderingItems = createListStory({
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
      fields: () => ({ hobby: fieldAtom({ value: "" }) }),
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
