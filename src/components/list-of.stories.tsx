/** biome-ignore-all lint/a11y/noRedundantRoles: Pico CSS */
/** biome-ignore-all lint/a11y/useSemanticElements: Pico CSS */
/** biome-ignore-all lint/a11y/useValidAnchor: Pico CSS */
import { parseWithZod } from "@conform-to/zod";
import { fieldAtom, InputField } from "form-atoms";
import { useActionState } from "react";
import { action } from "storybook/actions";
import { z } from "zod";
import { code as Code } from "../../.storybook/components/shiki-code";
import { type ListValue, listAtom } from "..";

import {
  createListStory,
  RemoveButton,
  render,
} from "../story/createListStory";
import { PicoError } from "../story/PicoFieldErrors";
import { PicoFieldName } from "../story/PicoFieldName";
import { ListOf } from ".";

const meta = { render };

export default meta;

const users = listAtom({
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

const staticInitialValue: ListValue<typeof users> = [
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

export const NestedList = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "Since the `listAtom()` supports nesting, we can render `<List.Of atom={} />` within a `<List.Item />`. As an example we capture multiple people with multiple banking accounts:",
      },
    },
  },
  decorators: [],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [state, formAction] = useActionState(
      (_: unknown, formData: FormData) => {
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
      "parsed" in state ? state.parsed.users : staticInitialValue;

    return (
      <form action={formAction}>
        <ListOf atom={users}>
          {({ List }) => (
            <List initialValue={initialValue}>
              <List.Item>
                {({ fields, index, count, moveUp, moveDown, remove }) => (
                  <article>
                    <details
                      open={index === count - 1}
                      name="only-one-open"
                      style={{ margin: 0 }}
                    >
                      <summary
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <header style={{ width: "100%" }}>
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
                      </summary>

                      <div className="grid">
                        <div>
                          <label htmlFor={`${fields.name}`}>First Name</label>
                          <InputField
                            atom={fields.name}
                            render={(props) => (
                              <input
                                {...props}
                                id={`${fields.name}`}
                                placeholder="Name"
                              />
                            )}
                          />
                          <PicoFieldName field={fields.name} />
                        </div>
                        <div>
                          <label htmlFor={`${fields.lastName}`}>
                            Last Name
                          </label>
                          <InputField
                            atom={fields.lastName}
                            render={(props) => (
                              <input
                                {...props}
                                id={`${fields.lastName}`}
                                placeholder="Last Name"
                              />
                            )}
                          />
                          <PicoFieldName field={fields.lastName} />
                        </div>
                      </div>
                      <blockquote>
                        <List.Of atom={fields.accounts}>
                          {({ List }) => (
                            <>
                              <List.Item>
                                {({ fields, index, remove }) => (
                                  <>
                                    <div>
                                      <label htmlFor={`${fields.iban}`}>
                                        Account #{index + 1}
                                      </label>
                                      <fieldset role="group">
                                        <InputField
                                          atom={fields.iban}
                                          render={(props) => (
                                            <input
                                              {...props}
                                              id={`${fields.iban}`}
                                              placeholder="IBAN"
                                            />
                                          )}
                                        />

                                        <RemoveButton remove={remove} />
                                      </fieldset>
                                      <PicoFieldName field={fields.iban} />
                                    </div>

                                    <blockquote>
                                      <p>Spending limits</p>
                                      <div className="grid">
                                        <div>
                                          <label
                                            htmlFor={`${fields.limits.card}`}
                                          >
                                            Card
                                          </label>
                                          <InputField
                                            atom={fields.limits.card}
                                            render={(props) => (
                                              <input
                                                {...props}
                                                id={`${fields.limits.card}`}
                                                placeholder="Card daily limit"
                                              />
                                            )}
                                          />
                                          <PicoFieldName
                                            field={fields.limits.card}
                                          />
                                        </div>
                                        <div>
                                          <label
                                            htmlFor={`${fields.limits.withdrawal}`}
                                          >
                                            Withdrawal
                                          </label>
                                          <InputField
                                            atom={fields.limits.withdrawal}
                                            render={(props) => (
                                              <input
                                                {...props}
                                                id={`${fields.limits.withdrawal}`}
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
                        </List.Of>
                      </blockquote>
                    </details>
                  </article>
                )}
              </List.Item>
              <List.Add>
                {({ add }) => (
                  <button
                    type="button"
                    className="outline"
                    onClick={() => add()}
                  >
                    Add Person
                  </button>
                )}
              </List.Add>
            </List>
          )}
        </ListOf>
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
