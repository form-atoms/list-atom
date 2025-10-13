"use client";

import { fieldAtom, InputField } from "form-atoms";
import { listAtom, createList } from "@form-atoms/list-atom";
import type { FormFieldValues } from "form-atoms";
import { FieldName } from "./field-name";

const environment = listAtom({
  name: "environment",
  value: [],
  fields: () => ({
    variable: fieldAtom({ name: "variable", value: "" }),
    value: fieldAtom({ name: "value", value: "" }),
  }),
});

const { List } = createList(environment);

const field = { environment };
export type FieldValues = FormFieldValues<typeof field>;

type Props = {
  action: any;
  initialValue?: FieldValues["environment"];
};

export const Form = ({
  initialValue = [
    { variable: "PACKAGE_NAME", value: "form-atoms" },
    { variable: "APP_URL", value: "https://jotai.org" },
  ],
  action,
}: Props) => {
  return (
    <form action={action}>
      <List initialValue={initialValue}>
        <List.Item>
          {({ fields, index, remove }) => (
            <div
              style={{
                display: "grid",
                gridGap: 16,
                gridTemplateColumns: "auto auto min-content",
              }}
            >
              {" "}
              <div>
                <InputField
                  atom={fields.variable}
                  render={(props) => (
                    <input
                      {...props}
                      placeholder={`Variable Name #${index + 1}`}
                    />
                  )}
                />
                <FieldName field={fields.variable} />
              </div>
              <div>
                <InputField
                  atom={fields.value}
                  render={(props) => (
                    <input
                      {...props}
                      placeholder={`Variable Value #${index + 1}`}
                    />
                  )}
                />
                <FieldName field={fields.value} />
              </div>
              <div>
                <button type="button" className="outline" onClick={remove}>
                  Remove
                </button>
              </div>
            </div>
          )}
        </List.Item>
        <List.Add>
          {({ add }) => (
            <button type="button" className="secondary" onClick={() => add()}>
              Add variable
            </button>
          )}
        </List.Add>
      </List>
      <hr />
      <button type="submit">Submit</button>
    </form>
  );
};
