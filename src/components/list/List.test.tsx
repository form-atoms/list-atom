import { act, render, renderHook, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { InputField, fieldAtom, formAtom, useFormSubmit } from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { List } from "./List";
import { listAtom } from "../../atoms";

describe("<List />", () => {
  it("renders each item", async () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
    });

    const form = formAtom({ friends });
    const { result } = renderHook(() => useFormSubmit(form));
    render(
      <List atom={friends}>
        {({ fields }) => <InputField atom={fields.name} component="input" />}
      </List>,
    );

    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();

    const onSubmit = vi.fn();
    await act(async () => result.current(onSubmit)());

    expect(onSubmit).toHaveBeenCalledWith({
      friends: [{ name: "Alice" }, { name: "Bob" }],
    });
  });

  describe("initialValue prop", () => {
    it("is used as submit value", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }, { name: "Bob" }],
        fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
      });

      const form = formAtom({ friends });
      const { result } = renderHook(() => useFormSubmit(form));
      render(
        <List atom={friends} initialValue={[{ name: "Mark" }]}>
          {({ fields }) => <InputField atom={fields.name} component="input" />}
        </List>,
      );

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

      render(
        <List atom={userList} initialValue={users}>
          {({ fields }) => <InputField atom={fields.name} component="input" />}
        </List>,
      );
    });
  });

  describe("RemoveButton render prop", () => {
    it("renders 'Remove' label by default", () => {
      const friends = listAtom({
        value: [{ name: "Alice" }],
        fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
      });

      render(
        <List atom={friends}>{({ RemoveButton }) => <RemoveButton />}</List>,
      );

      const RemoveButton = screen.getByText("Remove");

      expect(RemoveButton).toBeInTheDocument();
      expect(RemoveButton).toHaveAttribute("type", "button");
    });

    it("removes the respective list item", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }],
        fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
      });

      render(
        <List atom={friends}>
          {({ fields, RemoveButton }) => (
            <>
              <InputField atom={fields.name} component="input" />
              <RemoveButton />
            </>
          )}
        </List>,
      );

      const RemoveButton = screen.getByText("Remove");

      expect(RemoveButton).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Alice")).toBeInTheDocument();

      await act(() => userEvent.click(RemoveButton));

      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
    });
  });

  describe("AddButton render prop", () => {
    it("renders 'Add item' label by default", () => {
      const friends = listAtom({
        value: [],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      render(<List atom={friends}>{() => <></>}</List>);

      const AddButton = screen.getByText("Add item");

      expect(AddButton).toBeInTheDocument();
      expect(AddButton).toHaveAttribute("type", "button");
    });

    it("appends empty item to the list by calling the item builder prop", async () => {
      const friends = listAtom({
        value: [],
        fields: ({ name = "Alice" }) => ({ name: fieldAtom({ value: name }) }),
      });

      render(
        <List atom={friends}>
          {({ fields }) => (
            <InputField
              atom={fields.name}
              render={(props) => <input {...props} data-testid="friend" />}
            />
          )}
        </List>,
      );

      const AddButton = screen.getByText("Add item");

      expect(AddButton).toBeInTheDocument();

      await act(() => userEvent.click(AddButton));

      expect(screen.queryByDisplayValue("Alice")).toBeInTheDocument();
      expect(screen.queryAllByTestId("friend")).toHaveLength(1);
    });

    it("can add item with explicit fields", async () => {
      const friends = listAtom({
        value: [],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      render(
        <List
          atom={friends}
          AddButton={({ add }) => (
            <button
              type="button"
              onClick={() => add({ name: fieldAtom({ value: "Bobek" }) })}
            >
              add fields
            </button>
          )}
        >
          {({ fields }) => <InputField atom={fields.name} component="input" />}
        </List>,
      );

      const AddButton = screen.getByText("add fields");

      await act(() => userEvent.click(AddButton));

      expect(screen.queryByDisplayValue("Bobek")).toBeInTheDocument();
    });
  });

  describe("Empty render prop", () => {
    it("renders when there are no items", async () => {
      const friends = listAtom({
        value: [],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      render(
        <List atom={friends} Empty={() => <p>No friends</p>}>
          {({ fields }) => <InputField atom={fields.name} component="input" />}
        </List>,
      );

      expect(screen.queryByText("No friends")).toBeInTheDocument();
    });
  });
});
