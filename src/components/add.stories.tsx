import { InputField, fieldAtom } from "form-atoms";

import { listAtom } from "../atoms";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";

const meta = { render };

export default meta;

export const WithValue = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "The `add()` action accept a custom `Value` which will be used to initialize the added list item.",
      },
    },
  },
  args: {
    atom: listAtom({
      name: "productFeatures",
      value: [{ feature: "quality materials" }, { feature: "solid build" }],
      fields: () => ({ feature: fieldAtom({ value: "" }) }),
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
              onClick={() => add({ feature: "beautiful colors" })}
            >
              Add initialized item
            </button>
          )}
        </List.Add>
      </List>
    ),
  },
});

export const PositioningAddButton = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "You can position the `<List.Add>` action button freely in your form layouts. Here we use show it when the list is empty.",
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
              <p>
                You don't have any items in your list. Start by adding your
                first one.
              </p>
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
