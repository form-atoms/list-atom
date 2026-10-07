import { act, render, renderHook, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { type FieldAtom, fieldAtom, useFieldValue } from "form-atoms";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { describe, expect, it } from "vitest";
import { listAtom } from "../atoms";
import { createAdd } from "./add";

describe("<Add /> component", () => {
  it("renders 'Add item' label by default", () => {
    const friends = listAtom({
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
    expect(result.current[1]?.name).toBe("Bobek");
  });

  describe("getItemFields", () => {
    it("retrieves the fields of a newly added item", async () => {
      const friends = listAtom({
        fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
      });

      const { Add } = createAdd(friends);

      const { result: setFieldValueHook } = renderHook(() =>
        useAtomCallback(
          useCallback((get, set, field: FieldAtom<string>, value: string) => {
            set(get(field).value, value);
          }, []),
        ),
      );

      const { result: valueHook } = renderHook(() => useFieldValue(friends));

      render(
        <Add>
          {({ add, getItemFields }) => (
            <button
              type="button"
              onClick={() => {
                const item = add({ name: "Bobek" });
                const fields = getItemFields(item);

                // realistic example would be setting a file into uploadAtom
                setFieldValueHook.current(fields.name, "Lolek");
              }}
            >
              add fren
            </button>
          )}
        </Add>,
      );

      const AddFren = screen.getByText("add fren");

      await act(() => userEvent.click(AddFren));

      expect(valueHook.current).toHaveLength(1);
      expect(valueHook.current).toStrictEqual([{ name: "Lolek" }]);
    });
  });
});
