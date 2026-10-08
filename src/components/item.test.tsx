import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { fieldAtom, InputField } from "form-atoms";
import { describe, expect, it } from "vitest";
import { listAtom } from "../atoms";
import { createItem } from "./item";

describe("<Item />", () => {
  it("renders each list item", async () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: () => ({ name: fieldAtom({ value: "" }) }),
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

  it("passes the total count of items to children", () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: () => ({ name: fieldAtom({ value: "" }) }),
    });

    const { Item } = createItem(friends);
    render(
      <Item>
        {({ fields, count }) => (
          <>
            <InputField atom={fields.name} component="input" />
            <span>count: {count}</span>
          </>
        )}
      </Item>,
    );

    expect(screen.getAllByText("count: 2")).toHaveLength(2);
  });

  describe("remove action", () => {
    it("removes the respective list item", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }],
        fields: () => ({ name: fieldAtom({ value: "" }) }),
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
