import { act, render, renderHook, screen } from "@testing-library/react";
import { fieldAtom, formAtom, useFieldValue, useFormSubmit } from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { createList } from "./list";
import { listAtom } from "../atoms";

describe("<List />", () => {
  it("renders children", () => {
    const friends = listAtom({
      fields: () => ({ name: fieldAtom({ value: "" }) }),
    });
    const { List } = createList(friends);

    render(<List>layout</List>);

    expect(screen.queryByText("layout")).toBeInTheDocument();
  });

  describe("initialValue prop", () => {
    it("is used as a submit value", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }, { name: "Bob" }],
        fields: () => ({ name: fieldAtom({ value: "will be overriden" }) }),
      });

      const form = formAtom({ friends });
      const { result } = renderHook(() => useFormSubmit(form));
      const { List } = createList(friends);

      render(<List initialValue={[{ name: "Mark" }]}></List>);

      // mounts effect
      renderHook(() => useFieldValue(friends));

      const onSubmit = vi.fn();
      await act(async () => result.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({ friends: [{ name: "Mark" }] });
    });

    it("(bugfix #104) initializes with optional input without infine loop caused by perpetual store.set()", () => {
      type User = { id: string | undefined; name: string };
      // there is no "id" in initialValue
      const users = [{ name: "Alice" }] as User[];

      const userList = listAtom({
        fields: () => ({
          // the field.value will have "id: undefined" after initialization
          id: fieldAtom<string | undefined>({ value: undefined }),
          name: fieldAtom({ value: "" }),
        }),
      });

      const { List } = createList(userList);
      render(<List initialValue={users}></List>);
    });
  });
});
