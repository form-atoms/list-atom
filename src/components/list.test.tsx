import { act, render, renderHook, screen } from "@testing-library/react";
import { fieldAtom, formAtom, useFormSubmit } from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { createList } from "./list";
import { listAtom } from "../atoms";

describe("<List />", () => {
  it("renders children", () => {
    const friends = listAtom({
      value: [{ name: "Alice" }],
      fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
    });
    const { List } = createList(friends);

    render(<List>layout</List>);

    expect(screen.queryByText("layout")).toBeInTheDocument();
  });

  describe("initialValue prop", () => {
    it("is used as a submit value", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }, { name: "Bob" }],
        fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
      });

      const form = formAtom({ friends });
      const { result } = renderHook(() => useFormSubmit(form));
      const { List } = createList(friends);

      render(<List initialValue={[{ name: "Mark" }]} />);

      const onSubmit = vi.fn();
      await act(async () => result.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({ friends: [{ name: "Mark" }] });
    });

    it("(bugfix #104) initializes with optional input without infine loop caused by perpetual store.set()", () => {
      type User = { id?: string; name: string };
      // there is no "id" in initialValue
      const users: User[] = [{ name: "Alice" }];

      const userList = listAtom({
        value: [],
        fields: ({ name, id }: User) => ({
          // the field.value will have "id: undefined" after initialization
          id: fieldAtom({ value: id }),
          name: fieldAtom({ value: name }),
        }),
      });

      const { List } = createList(userList);
      render(<List initialValue={users}></List>);
    });
  });
});
