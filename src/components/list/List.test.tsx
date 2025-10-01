import { act, render, renderHook, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { InputField, fieldAtom, formAtom, useFormSubmit } from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { createComponents } from "../";
import { listAtom } from "../../atoms";

describe("<List />", () => {
  it("renders each item", async () => {
    const friends = listAtom({
      value: [{ name: "Alice" }, { name: "Bob" }],
      fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
    });

    const form = formAtom({ friends });
    const { result } = renderHook(() => useFormSubmit(form));
    const List = createComponents(friends);
    render(
      <List>
        <List.Item>
          {({ fields }) => <InputField atom={fields.name} component="input" />}
        </List.Item>
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
      const List = createComponents(friends);

      render(
        <List initialValue={[{ name: "Mark" }]}>
          <List.Item>
            {({ fields }) => (
              <InputField atom={fields.name} component="input" />
            )}
          </List.Item>
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

      const List = createComponents(userList);
      render(
        <List initialValue={users}>
          <List.Item>
            {({ fields }) => (
              <InputField atom={fields.name} component="input" />
            )}
          </List.Item>
        </List>,
      );
    });
  });

  describe("List.Item remove action", () => {
    it("removes the respective list item", async () => {
      const friends = listAtom({
        value: [{ name: "Alice" }],
        fields: ({ name }) => ({ name: fieldAtom({ value: name }) }),
      });

      const List = createComponents(friends);

      render(
        <List>
          <List.Item>
            {({ fields, remove }) => (
              <>
                <InputField atom={fields.name} component="input" />
                <button type="button" onClick={remove}>
                  Remove
                </button>
              </>
            )}
          </List.Item>
        </List>,
      );

      const RemoveButton = screen.getByText("Remove");

      expect(RemoveButton).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Alice")).toBeInTheDocument();

      await act(() => userEvent.click(RemoveButton));

      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
    });
  });

  describe("List.Add component", () => {
    it("renders 'Add item' label by default", () => {
      const friends = listAtom({
        value: [],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      // @ts-ignore FIXME empty value array
      const List = createComponents(friends);

      render(
        <List>
          <List.Add />
        </List>,
      );

      const AddButton = screen.getByText("Add item");

      expect(AddButton).toBeInTheDocument();
      expect(AddButton).toHaveAttribute("type", "button");
    });

    it("appends empty item to the list by calling the item builder prop", async () => {
      const friends = listAtom({
        value: [{ name: "Bobek" }],
        fields: ({ name = "Alice" }) => ({ name: fieldAtom({ value: name }) }),
      });

      const List = createComponents(friends);

      render(
        <List>
          <List.Item>
            {({ fields }) => (
              <InputField
                atom={fields.name}
                render={(props) => <input {...props} data-testid="friend" />}
              />
            )}
          </List.Item>
          <List.Add />
        </List>,
      );

      const AddButton = screen.getByText("Add item");

      expect(AddButton).toBeInTheDocument();
      expect(screen.queryAllByTestId("friend")).toHaveLength(1);

      await act(() => userEvent.click(AddButton));

      expect(screen.queryAllByTestId("friend")).toHaveLength(2);
    });

    it("can add item with explicit fields", async () => {
      const friends = listAtom({
        value: [{ name: "Lolek" }],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      const List = createComponents(friends);

      render(
        <List>
          <List.Item>
            {({ fields }) => (
              <InputField atom={fields.name} component="input" />
            )}
          </List.Item>
          <List.Add>
            {({ add }) => (
              <button
                type="button"
                onClick={() => add({ name: fieldAtom({ value: "Bobek" }) })}
              >
                add fren
              </button>
            )}
          </List.Add>
        </List>,
      );

      const AddFren = screen.getByText("add fren");

      expect(screen.queryByDisplayValue("Bobek")).not.toBeInTheDocument();

      await act(() => userEvent.click(AddFren));

      expect(screen.queryByDisplayValue("Bobek")).toBeInTheDocument();
    });
  });

  describe("List.Empty component", () => {
    it("renders children when there are no items", async () => {
      const friends = listAtom({
        value: [],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      // @ts-ignore FIXME empty value array
      const List = createComponents(friends);

      render(
        <List>
          <List.Empty>No frens</List.Empty>
        </List>,
      );

      expect(screen.queryByText("No frens")).toBeInTheDocument();
    });

    it("renders nothing when there are some items", async () => {
      const friends = listAtom({
        value: [{ name: "Bobette" }],
        fields: ({ name }) => ({ name: fieldAtom<string>({ value: name }) }),
      });

      const List = createComponents(friends);

      render(
        <List>
          <List.Empty>empty message</List.Empty>
        </List>,
      );

      expect(screen.queryByText("empty message")).not.toBeInTheDocument();
    });
  });
});
