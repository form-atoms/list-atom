import { act, render, renderHook, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { fieldAtom, useFieldValue } from "form-atoms";
import { describe, expect, it } from "vitest";

import { createAdd } from "./add";
import { listAtom } from "../atoms";

describe("<Add /> component", () => {
  it("renders 'Add item' label by default", () => {
    const friends = listAtom({
      value: [],
      fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
    });

    const { Add } = createAdd(friends);

    render(<Add />);

    const AddButton = screen.getByText("Add item");

    expect(AddButton).toBeInTheDocument();
    expect(AddButton).toHaveAttribute("type", "button");
  });

  it("appends empty item to the list", async () => {
    const friends = listAtom({
      value: [{ name: "Bobek" }],
      fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
    });

    const { Add } = createAdd(friends);

    render(<Add />);

    const AddButton = screen.getByText("Add item");

    expect(AddButton).toBeInTheDocument();
    const { result } = renderHook(() => useFieldValue(friends));

    expect(result.current).toHaveLength(1);

    await act(() => userEvent.click(AddButton));

    expect(result.current).toHaveLength(2);
  });

  it("adds list item with initialized fields", async () => {
    const friends = listAtom({
      value: [{ name: "Lolek" }],
      fields: () => ({
        name: fieldAtom<string>({ value: "" }),
      }),
    });

    const { Add } = createAdd(friends);

    render(
      <Add>
        {({ add }) => (
          <button type="button" onClick={() => add({ name: "Bobek" })}>
            add fren
          </button>
        )}
      </Add>,
    );

    const AddFren = screen.getByText("add fren");

    const { result } = renderHook(() => useFieldValue(friends));

    expect(result.current).toHaveLength(1);

    await act(() => userEvent.click(AddFren));

    expect(result.current).toHaveLength(2);
    expect(result.current[1]!.name).toBe("Bobek");
  });
});
