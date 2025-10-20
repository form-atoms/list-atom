import { render, screen } from "@testing-library/react";
import { InputField, fieldAtom } from "form-atoms";
import { describe, expect, it } from "vitest";

import { ListOf } from "./list-of";
import { listAtom } from "../atoms";

describe("<ListOf />", () => {
  it("creates the compound components within JSX", () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: () => ({ name: fieldAtom({ value: "" }) }),
    });

    render(
      <ListOf atom={friends}>
        {({ List }) => (
          <List.Item>
            {({ fields }) => (
              <InputField atom={fields.name} component="input" />
            )}
          </List.Item>
        )}
      </ListOf>,
    );

    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });
});
