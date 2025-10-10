import { InputField, fieldAtom } from "form-atoms";

import { listAtom } from "../atoms";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";

const meta = { render };

export default meta;

export const EmptyOrInitialValue = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "By default the `<List.Add>` renders a button to add an empty item. Optionally, the `add()` action accept a custom `Value` which will be used to initialize the added list item.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "productFeatures",
      value: [],
      fields: () => ({ feature: fieldAtom({ value: "" }) }),
    }),
    children: ({ List }) => (
      <List
        initialValue={[
          { feature: "quality materials used" },
          { feature: "not so heavy" },
        ]}
      >
        <List.Item>
          {({ fields, remove }) => (
            <fieldset role="group">
              <InputField atom={fields.feature} component="input" />
              <RemoveButton remove={remove} />
            </fieldset>
          )}
        </List.Item>
        <div className="grid">
          <List.Add />
          <div />
          <List.Add>
            {({ add }) => (
              <button
                type="button"
                className="secondary"
                onClick={() => add({ feature: "beautiful colors" })}
              >
                Add initialized item
              </button>
            )}
          </List.Add>
        </div>
      </List>
    ),
  },
});

export const PositioningAddButton = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "You can position the `<List.Add>` action button freely in your form layouts. Here we use show it when the list is empty. Note that the `add` action is also available in the `<List.Item>`.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "productFeatures",
      value: [],
      fields: () => ({ feature: fieldAtom({ value: "" }) }),
    }),
    children: ({ List }) => {
      return (
        <>
          <List.Empty>
            <article style={{ textAlign: "center" }}>
              <h5>You don't have any items in your list.</h5>
              <p>Start by adding your first one.</p>
              <List.Add>
                {({ add }) => (
                  <button className="outline" onClick={() => add()}>
                    Add first
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
        </>
      );
    },
  },
});
