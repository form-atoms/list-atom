import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { InputField, fieldAtom } from "form-atoms";
import { describe, expect, it } from "vitest";

import { createItem } from "./item";
import { listAtom } from "../atoms";

describe("<Item />", () => {
  it("renders each list item", async () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
    });

    const { Item } = createItem(friends);
    render(
      <Item>
        {({ fields }) => <InputField atom={fields.name} component="input" />}
      </Item>,
    );

    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  describe("remove action", () => {
    it("removes the respective list item", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }],
        fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
      });

      const { Item } = createItem(friends);

      render(
        <Item>
          {({ fields, remove }) => (
            <>
              <InputField atom={fields.name} component="input" />
              <button type="button" onClick={remove}>
                Remove
              </button>
            </>
          )}
        </Item>,
      );

      const removeButton = screen.getByText("Remove");

      expect(removeButton).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Alice")).toBeInTheDocument();

      await act(() => userEvent.click(removeButton));

      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
    });
  });
});
