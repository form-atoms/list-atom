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
        story:
          "New list item can be prepended to an existing item by calling `add(item)`.",
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
          {({ fields, item, add, remove }) => (
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

export const DisableCarouselOrdering = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "By default, the `moveUp` and `moveDown` actions support carousel effect, where the first item moves to the last position and vice versa. To opt-out of this behavior, you can use the `index` position to disable the actions.",
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
          {({ fields, index, count, moveUp, moveDown, remove }) => (
            <fieldset role="group">
              <InputField atom={fields.hobby} component="input" />
              <button
                type="button"
                className="outline"
                disabled={index === 0}
                onClick={moveUp}
              >
                Up
              </button>
              <button
                type="button"
                className="outline"
                disabled={index === count - 1}
                onClick={moveDown}
              >
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
