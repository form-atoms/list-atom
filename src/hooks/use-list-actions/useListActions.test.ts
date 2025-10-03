import { act, renderHook } from "@testing-library/react";
import {
  fieldAtom,
  formAtom,
  useFieldErrors,
  useFieldValue,
  useFormSubmit,
} from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { useListActions } from "./useListActions";
import { listAtom } from "../../atoms";
import { useListState } from "../use-list-state";

describe("useListActions()", () => {
  describe("add()", () => {
    it("appends a new item to the list", async () => {
      const contacts = listAtom({
        value: [{ email: "foo@bar.com" }],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
      });
      const form = formAtom({ contacts });

      // mounts effect
      renderHook(() => useFieldValue(contacts));
      const { result: actions } = renderHook(() => useListActions(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(() => actions.current.add());

      const onSubmit = vi.fn();
      await act(() => formSubmit.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({
        contacts: [{ email: "foo@bar.com" }, { email: "" }],
      });
    });

    it("adds the item before a field when specified", async () => {
      const contacts = listAtom({
        value: [{ email: "foo@bar.com" }],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
      });
      const form = formAtom({ contacts });

      const { result: actions } = renderHook(() => useListActions(contacts));
      const { result: state } = renderHook(() => useListState(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(() => actions.current.add(state.current.items[0]));

      const onSubmit = vi.fn();
      await act(() => formSubmit.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({
        contacts: [{ email: "" }, { email: "foo@bar.com" }],
      });
    });

    it("validates the field", async () => {
      const contacts = listAtom({
        value: [],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
        validate: ({ value }) => (value.length > 0 ? [] : ["required"]),
      });

      const form = formAtom({ contacts });
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(async () => formSubmit.current(vi.fn())());

      const { result: errors } = renderHook(() => useFieldErrors(contacts));
      const { result: actions } = renderHook(() => useListActions(contacts));

      expect(errors.current).toEqual(["required"]);

      await act(async () => actions.current.add());

      expect(errors.current).toEqual([]);
    });
  });

  describe("remove()", () => {
    it("submits without the removed item", async () => {
      const contacts = listAtom({
        value: [{ email: "foo@bar.com" }],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
      });
      const form = formAtom({ contacts });

      const { result: actions } = renderHook(() => useListActions(contacts));
      const { result: state } = renderHook(() => useListState(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(() => actions.current.remove(state.current.items[0]!));

      const onSubmit = vi.fn();
      await act(() => formSubmit.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({
        contacts: [],
      });
    });

    it("validates the field", async () => {
      const contacts = listAtom({
        value: [
          { email: "primary@contact.com" },
          { email: "secondary@contact.com" },
          { email: "too@many.com" },
        ],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
        validate: ({ value }) =>
          value.length > 2 ? ["at most 2 contacts allowed"] : [],
      });
      const form = formAtom({ contacts });
      const { result: submit } = renderHook(() => useFormSubmit(form));

      await act(async () => submit.current(vi.fn())());

      const { result: errors } = renderHook(() => useFieldErrors(contacts));
      const { result: actions } = renderHook(() => useListActions(contacts));
      const { result: state } = renderHook(() => useListState(contacts));

      expect(errors.current).toEqual(["at most 2 contacts allowed"]);

      await act(async () =>
        actions.current.remove(state.current.items.at(-1)!),
      );

      expect(errors.current).toEqual([]);
    });
  });

  describe("move()", () => {
    it("reorders the items", async () => {
      const contacts = listAtom({
        value: [
          { email: "primary@contact.com" },
          { email: "secondary@contact.com" },
        ],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
      });
      const form = formAtom({ contacts });

      const { result: actions } = renderHook(() => useListActions(contacts));
      const { result: state } = renderHook(() => useListState(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(() =>
        actions.current.move(
          state.current.items.at(-1)!,
          state.current.items.at(0)!,
        ),
      );

      const onSubmit = vi.fn();
      await act(() => formSubmit.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({
        contacts: [
          { email: "secondary@contact.com" },
          { email: "primary@contact.com" },
        ],
      });
    });
  });
});
