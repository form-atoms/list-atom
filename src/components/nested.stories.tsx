import { InputField, fieldAtom } from "form-atoms";

import { listAtom } from "../atoms";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";

const meta = { render };

export default meta;

export const NestedList = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "Since the `listAtom()` supports nesting, we can render `<List.Nested atom={} />` within a `<List.Item />`. As an example we capture multiple people with multiple banking accounts:",
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
      fields: () => ({
        name: fieldAtom({ value: "", name: "name" }),
        lastName: fieldAtom({ value: "", name: "lastName" }),
        accounts: listAtom({
          name: "accounts",
          value: [],
          fields: () => ({
            iban: fieldAtom({ value: "", name: "iban" }),
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
                          <fieldset role="group">
                            <InputField
                              atom={fields.iban}
                              render={(props) => (
                                <input {...props} placeholder="IBAN" />
                              )}
                            />
                            <RemoveButton remove={remove} />
                          </fieldset>
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
