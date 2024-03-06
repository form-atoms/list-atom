import { act, renderHook } from "@testing-library/react";
import { fieldAtom, formAtom, useFormSubmit } from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { useList } from "./useList";
import { listAtom } from "../../atoms";

describe("useListAtom()", () => {
  describe("item.remove() with a single item", () => {
    it("removes the item and the list becomes empty", async () => {
      const contacts = listAtom({
        value: [{ email: "foo@bar.com" }],
        fields: ({ email = "hello@world.com" }) => ({
          email: fieldAtom({ value: email }),
        }),
      });
      const form = formAtom({ contacts });

      const { result: list } = renderHook(() => useList(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(async () => list.current.items[0]!.remove());

      const onSubmit = vi.fn();
      await act(async () => formSubmit.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({ contacts: [] });
      expect(list.current.isEmpty).toBe(true);
    });
  });

  describe("item.moveUp()", () => {
    it("moves the item before the previous item in the list", async () => {
      const contacts = listAtom({
        value: [
          { email: "primary@contact.com" },
          { email: "secondary@contact.com" },
        ],
        fields: ({ email = "hello@world.com" }) => ({
          email: fieldAtom({ value: email }),
        }),
      });
      const form = formAtom({ contacts });

      const { result: list } = renderHook(() => useList(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(() => list.current.items[1]!.moveUp());

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

  describe("item.moveDown()", () => {
    it("moves item below the next item in the list", async () => {
      const contacts = listAtom({
        value: [
          { email: "primary@contact.com" },
          { email: "secondary@contact.com" },
        ],
        fields: ({ email = "hello@world.com" }) => ({
          email: fieldAtom({ value: email }),
        }),
      });
      const form = formAtom({ contacts });

      const { result: list } = renderHook(() => useList(contacts));
      const { result: formSubmit } = renderHook(() => useFormSubmit(form));

      await act(() => list.current.items[0]!.moveDown());

      const onSubmit = vi.fn();
      await act(() => formSubmit.current(onSubmit)());

      expect(onSubmit).toHaveBeenCalledWith({
        contacts: [
          { email: "secondary@contact.com" },
          { email: "primary@contact.com" },
        ],
      });
    });

    describe("when the item is last", () => {
      it("is moved to the start of the list", async () => {
        const contacts = listAtom({
          value: [
            { email: "primary@contact.com" },
            { email: "secondary@contact.com" },
          ],
          fields: ({ email = "hello@world.com" }) => ({
            email: fieldAtom({ value: email }),
          }),
        });
        const form = formAtom({ contacts });

        const { result: list } = renderHook(() => useList(contacts));
        const { result: formSubmit } = renderHook(() => useFormSubmit(form));

        await act(() => list.current.items.at(-1)!.moveDown());

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
});
