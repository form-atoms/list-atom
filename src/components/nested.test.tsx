import { render, screen } from "@testing-library/react";
import { InputField, fieldAtom } from "form-atoms";
import { describe, expect, it } from "vitest";

import { Nested } from "./nested";
import { listAtom } from "../atoms";

describe("<Nested />", () => {
  it("creates the compound components within JSX", () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
    });

    render(
      <Nested atom={friends}>
        {({ List }) => (
          <List.Item>
            {({ fields }) => (
              <InputField atom={fields.name} component="input" />
            )}
          </List.Item>
        )}
      </Nested>,
    );

    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });
});
