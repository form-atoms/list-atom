import { useActionState, useState } from "react";
import { InputField, fieldAtom } from "form-atoms";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { action } from "storybook/actions";

import { code as Code } from "../../.storybook/components/shiki-code";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";
import { PicoFieldName } from "../story/PicoFieldName";
import { PicoError } from "../story/PicoFieldErrors";

import { createList, listAtom } from "../";

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
  decorators: [],
  render: () => {
    const [{ List }] = useState(() => {
      const atom = listAtom({
        name: "users",
        fields: () => ({
          name: fieldAtom({ value: "", name: "name" }),
          lastName: fieldAtom({ value: "", name: "lastName" }),
          accounts: listAtom({
            name: "accounts",
            fields: () => ({
              limits: {
                card: fieldAtom({ value: 0 }),
                withdrawal: fieldAtom({ value: 0 }),
              },
              iban: fieldAtom({ value: "", name: "iban" }),
            }),
          }),
        }),
      });

      return createList(atom);
    });

    const [state, formAction] = useActionState(
      (_, formData: FormData) => {
        const result = parseWithZod(formData, {
          schema: z.object({
            users: z.array(
              z.object({
                name: z.string(),
                lastName: z.string(),
                accounts: z.array(
                  z.object({
                    iban: z.string(),
                    limits: z.object({
                      card: z.coerce.number().min(0),
                      withdrawal: z.coerce.number().min(0),
                    }),
                  }),
                ),
              }),
            ),
          }),
        });

        if (result.status === "success") {
          const value = {
            parsed: result.value,
            serialized: Object.fromEntries(formData.entries()),
          };

          action("parseFormData")(value);

          return value;
        } else {
          return { message: "Failed to parse form data. Fields are required." };
        }
      },
      { message: "" },
    );

    const initialValue =
      "parsed" in state
        ? state.parsed.users
        : [
            { name: "Daniel", lastName: "Simons", accounts: [] },
            {
              name: "Jerry",
              lastName: "Park",
              accounts: [
                {
                  iban: "SK89 7500 0000 0000 1234 5671",
                  limits: { card: 0, withdrawal: 0 },
                },
              ],
            },
          ];

    return (
      <form action={formAction}>
        <List initialValue={initialValue}>
          <List.Item>
            {({ fields, index, moveUp, moveDown, remove }) => (
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
                            moveUp();
                          }}
                        >
                          Up
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          role="button"
                          className="outline secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            moveDown();
                          }}
                        >
                          Down
                        </a>
                      </li>
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
                      render={(props) => (
                        <input {...props} placeholder="Name" />
                      )}
                    />
                    <PicoFieldName field={fields.name} />
                  </div>
                  <div>
                    <label>Last Name</label>
                    <InputField
                      atom={fields.lastName}
                      render={(props) => (
                        <input {...props} placeholder="Last Name" />
                      )}
                    />
                    <PicoFieldName field={fields.lastName} />
                  </div>
                </div>
                <blockquote>
                  <List.Nested atom={fields.accounts}>
                    {({ List }) => (
                      <>
                        <List.Item>
                          {({ fields, index, remove }) => (
                            <>
                              <div>
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
                                <PicoFieldName field={fields.iban} />
                              </div>

                              <blockquote>
                                <label>Spending limits</label>

                                <div className="grid">
                                  <div>
                                    <label>Card</label>
                                    <InputField
                                      atom={fields.limits.card}
                                      render={(props) => (
                                        <input
                                          {...props}
                                          placeholder="Card daily limit"
                                        />
                                      )}
                                    />
                                    <PicoFieldName field={fields.limits.card} />
                                  </div>
                                  <div>
                                    <label>Withdrawal</label>
                                    <InputField
                                      atom={fields.limits.withdrawal}
                                      render={(props) => (
                                        <input
                                          {...props}
                                          placeholder="Withdrawal daily limit"
                                        />
                                      )}
                                    />
                                    <PicoFieldName
                                      field={fields.limits.withdrawal}
                                    />
                                  </div>
                                </div>
                              </blockquote>
                            </>
                          )}
                        </List.Item>
                        <List.Add>
                          {({ add }) => (
                            <button
                              type="button"
                              className="outline"
                              style={{ margin: 0 }}
                              onClick={() => add()}
                            >
                              Add Bank Account
                            </button>
                          )}
                        </List.Add>
                      </>
                    )}
                  </List.Nested>
                </blockquote>
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
        {"message" in state && state.message && (
          <PicoError>{state.message}</PicoError>
        )}
        <button type="submit" className="primary">
          Submit form action
        </button>
        {"serialized" in state && (
          <Code className="language-json">
            {JSON.stringify(state.serialized, null, 2)}
          </Code>
        )}
        {"parsed" in state && (
          <Code className="language-json">
            {JSON.stringify(state.parsed.users, null, 2)}
          </Code>
        )}
      </form>
    );
  },
  // @ts-expect-error empty type
  args: {},
});
