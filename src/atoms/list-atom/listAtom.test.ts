import { act, renderHook, waitFor } from "@testing-library/react";
import {
  FieldAtom,
  fieldAtom,
  formAtom,
  useFieldActions,
  useFieldErrors,
  useFieldState,
  useFieldValue,
  useFormActions,
  useFormSubmit,
} from "form-atoms";
import { useAtomValue } from "jotai";
import { describe, expect, it, test, vi } from "vitest";

import { listAtom } from "./listAtom";
import { useList, useListActions } from "../../hooks";

describe("listAtom()", () => {
  test("can be submitted within formAtom", async () => {
    const nums = listAtom({
      value: [{ age: 20 }, { age: 30 }],
      fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
    });

    const form = formAtom({ nums });

    const { result: submit } = renderHook(() => useFormSubmit(form));

    const onSubmit = vi.fn();

    await act(async () => submit.current(onSubmit)());

    expect(onSubmit).toHaveBeenCalledWith({ nums: [{ age: 20 }, { age: 30 }] });
  });

  describe("empty atom", () => {
    it("is true when values is empty array", () => {
      const list = listAtom({
        value: [],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
      });

      const { result } = renderHook(() =>
        useAtomValue(useAtomValue(list).empty),
      );

      expect(result.current).toBe(true);
    });

    it("is false when value contain data", () => {
      const list = listAtom({
        value: [{ age: 3 }],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
      });

      const { result } = renderHook(() =>
        useAtomValue(useAtomValue(list).empty),
      );

      expect(result.current).toBe(false);
    });
  });

  test("useFieldValue() reads list of value", () => {
    const list = listAtom({
      value: [{ age: 80 }, { age: 70 }],
      fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
    });

    const result = renderHook(() => useFieldValue(list));

    expect(result.result.current).toEqual([{ age: 80 }, { age: 70 }]);
  });

  describe("useFieldActions(listAtom).setValue", () => {
    test("works with array value", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
      });

      const { result: fieldActions } = renderHook(() => useFieldActions(ages));

      await act(async () =>
        fieldActions.current.setValue([{ age: 20 }, { age: 40 }]),
      );

      const result = renderHook(() => useFieldValue(ages));

      expect(result.result.current).toEqual([{ age: 20 }, { age: 40 }]);
    });

    test("works with a callback function", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
      });

      const { result: fieldActions } = renderHook(() => useFieldActions(ages));

      await act(async () =>
        fieldActions.current.setValue((ages) => [...ages, { age: 30 }]),
      );

      const result = renderHook(() => useFieldValue(ages));

      expect(result.result.current).toEqual([{ age: 10 }, { age: 30 }]);
    });

    test("throws for non-array value", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
      });

      const { result: fieldActions } = renderHook(() => useFieldActions(ages));

      // @ts-expect-error invalid value
      expect(() => fieldActions.current.setValue({ age: 30 })).toThrowError();
    });
  });

  describe("resetting form", () => {
    test("the formActions.reset resets the field value", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
      });
      const form = formAtom({ ages });

      const { result: formActions } = renderHook(() => useFormActions(form));
      const { result: fieldActions } = renderHook(() => useFieldActions(ages));

      await act(async () => fieldActions.current.setValue([{ age: 30 }]));
      const onSubmit = vi.fn();
      await act(async () => formActions.current.submit(onSubmit)());
      expect(onSubmit).toHaveBeenCalledWith({ ages: [{ age: 30 }] });

      await act(async () => formActions.current.reset());

      const reset_onSubmit = vi.fn();
      await act(async () => formActions.current.submit(reset_onSubmit)());
      expect(reset_onSubmit).toHaveBeenCalledWith({ ages: [{ age: 10 }] });
    });

    test("the formActions.reset resets the field error", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: ({ age }) => ({ age: fieldAtom<number>({ value: age }) }),
        validate: () => ["err"],
      });
      const form = formAtom({ ages });

      const { result: formActions } = renderHook(() => useFormActions(form));
      const { result: fieldErrors } = renderHook(() => useFieldErrors(ages));

      const onSubmit = vi.fn();
      await act(async () => formActions.current.submit(onSubmit)());

      expect(fieldErrors.current).to.toEqual(["err"]);

      await act(async () => formActions.current.reset());

      expect(fieldErrors.current).toEqual([]);
    });
  });

  describe("validation", () => {
    it("adding item clear the error", async () => {
      const field = listAtom({
        value: [],
        fields: ({ email }) => ({ email: fieldAtom<string>({ value: email }) }),
        validate: ({ value }) => {
          const errors = [];
          if (value.length === 0) {
            errors.push("Can't be empty");
          }
          return errors;
        },
      });

      const { result: actions } = renderHook(() => useFieldActions(field));
      const { result: errors } = renderHook(() => useFieldErrors(field));

      await act(async () => actions.current.validate());

      expect(errors.current).toEqual(["Can't be empty"]);

      const { result: listActions } = renderHook(() => useListActions(field));

      await act(async () => listActions.current.add());

      expect(errors.current).toEqual([]);
    });

    it("validates the inner form items", async () => {
      const field = listAtom({
        value: [{ email: undefined }],
        invalidItemError: "err",
        fields: ({ email }) => ({
          email: fieldAtom<string | undefined>({
            value: email,
            validate: ({ value }) => (value ? [] : ["required"]),
          }),
        }),
      });

      const { result: actions } = renderHook(() => useFieldActions(field));
      const { result: errors } = renderHook(() => useFieldErrors(field));

      await act(async () => actions.current.validate());

      expect(errors.current).toEqual(["err"]);
    });
  });

  describe("nested validation", () => {
    it("can't be submitted with invalid item's field", async () => {
      const field = listAtom({
        value: [{ age: undefined }],
        fields: ({ age }) => ({
          age: fieldAtom<number | undefined>({
            value: age,
            validate: ({ value }) => (value ? [] : ["required"]),
          }),
        }),
      });

      const form = formAtom({ field });

      const { result: submit } = renderHook(() => useFormSubmit(form));
      const onSubmit = vi.fn();
      await act(async () => submit.current(onSubmit)());

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("can't be submitted when item of nested list is invalid", async () => {
      const field = listAtom({
        name: "users",
        value: [{ accounts: [{ iban: undefined }] }],
        fields: ({ accounts }) => ({
          accounts: listAtom({
            name: "bank-accounts",
            value: accounts,
            fields: ({ iban }) => ({
              iban: fieldAtom<string | undefined>({
                name: "iban",
                value: iban,
                validate: ({ value }) => (value ? [] : ["required"]),
              }),
            }),
          }),
        }),
      });

      const form = formAtom({ field });

      const { result: submit } = renderHook(() => useFormSubmit(form));
      const onSubmit = vi.fn();
      await act(async () => submit.current(onSubmit)());

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("has the invalidItemError, when item of nested list is invalid", async () => {
      const field = listAtom({
        invalidItemError: "There are some errors",
        value: [{ age: undefined }],
        fields: ({ age }) => ({
          age: fieldAtom<number | undefined>({
            value: age,
            validate: ({ value }) => (value ? [] : ["required"]),
          }),
        }),
      });

      const form = formAtom({ field });

      const { result: submit } = renderHook(() => useFormSubmit(form));
      const { result: fieldErrors } = renderHook(() => useFieldErrors(field));

      await act(async () => submit.current(vi.fn())());

      expect(fieldErrors.current).toEqual(["There are some errors"]);
    });

    it("loses invalidItemError, when the nested item error is fixed", async () => {
      const field = listAtom({
        value: [{ age: undefined }],
        fields: ({ age }) => ({
          age: fieldAtom<number | undefined>({
            value: age,
            validate: ({ value }) => (value ? [] : ["required"]),
          }),
        }),
      });

      const form = formAtom({ field });

      const { result: submit } = renderHook(() => useFormSubmit(form));
      const { result: fieldErrors } = renderHook(() => useFieldErrors(field));
      const { result: formFields } = renderHook(() =>
        useAtomValue(useAtomValue(field)._formFields),
      );

      const { result: inputActions } = renderHook(() =>
        useFieldActions(formFields.current[0]!.age),
      );

      expect(fieldErrors.current).toEqual([]);

      await act(async () => submit.current(vi.fn())());
      expect(fieldErrors.current).toEqual(["Some list items contain errors."]);

      await act(async () => inputActions.current.setValue(29));
      expect(fieldErrors.current).toEqual([]);
    });
  });

  describe("dirty", () => {
    it("becomes dirty when an item is removed", async () => {
      const field = listAtom({
        value: [{ age: 42 }],
        fields: ({ age }) => ({
          age: fieldAtom<number>({ value: age }),
        }),
      });

      const { result: state } = renderHook(() => useFieldState(field));
      const { result: listActions } = renderHook(() => useListActions(field));
      const { result: list } = renderHook(() =>
        useAtomValue(useAtomValue(field)._splitList),
      );
      expect(state.current.dirty).toBe(false);

      await act(async () => listActions.current.remove(list.current[0]!));
      expect(state.current.dirty).toBe(true);
    });

    it("becomes dirty when an item is added", async () => {
      const field = listAtom({
        value: [],
        fields: ({ age }) => ({
          age: fieldAtom<number>({ value: age }),
        }),
      });

      const { result: state } = renderHook(() => useFieldState(field));
      const { result: listActions } = renderHook(() => useListActions(field));

      expect(state.current.dirty).toBe(false);

      await act(async () => listActions.current.add());
      expect(state.current.dirty).toBe(true);
    });

    it("becomes dirty when items are reordered", async () => {
      const field = listAtom({
        value: [{ age: 42 }, { age: 84 }],
        fields: ({ age }) => ({
          age: fieldAtom<number>({ value: age }),
        }),
      });

      const { result: state } = renderHook(() => useFieldState(field));
      const { result: listActions } = renderHook(() => useListActions(field));
      const { result: list } = renderHook(() =>
        useAtomValue(useAtomValue(field)._splitList),
      );
      expect(state.current.dirty).toBe(false);

      await act(async () => listActions.current.move(list.current[0]!));
      expect(state.current.dirty).toBe(true);
    });

    it("becomes dirty when some item field is edited", async () => {
      const field = listAtom({
        value: [{ age: 21 }],
        fields: ({ age }) => ({
          age: fieldAtom<number>({ value: age }),
        }),
      });

      const { result: fieldState } = renderHook(() => useFieldState(field));
      const { result: formFields } = renderHook(() =>
        useAtomValue(useAtomValue(field)._formFields),
      );
      const { result: inputActions } = renderHook(() =>
        useFieldActions(formFields.current[0]!.age),
      );

      expect(fieldState.current.dirty).toBe(false);

      await act(async () => inputActions.current.setValue(42));
      expect(fieldState.current.dirty).toBe(true);

      await act(async () => inputActions.current.reset());
      expect(fieldState.current.dirty).toBe(false);
    });

    it("becomes pristine when items are reordered & back", async () => {
      const field = listAtom({
        value: [{ age: 42 }, { age: 84 }],
        fields: ({ age }) => ({
          age: fieldAtom<number>({ value: age }),
        }),
      });

      const { result: state } = renderHook(() => useFieldState(field));
      const { result: listActions } = renderHook(() => useListActions(field));
      const { result: list } = renderHook(() =>
        useAtomValue(useAtomValue(field)._splitList),
      );
      expect(state.current.dirty).toBe(false);

      // moves first item down
      await act(async () => listActions.current.move(list.current[0]!));
      expect(state.current.dirty).toBe(true);

      // moves first item down
      await act(async () => listActions.current.move(list.current[0]!));
      expect(state.current.dirty).toBe(false);
    });

    it("becomes pristine after value is set (the set is usually called by useFieldInitialValue to hydrate the field)", async () => {
      const field = listAtom({
        value: [{ age: 21 }],
        fields: ({ age }) => ({
          age: fieldAtom<number>({ value: age }),
        }),
      });

      const { result: state } = renderHook(() => useFieldState(field));
      const { result: fieldActions } = renderHook(() => useFieldActions(field));

      // make list dirty
      const { result: listActions } = renderHook(() => useListActions(field));
      await act(async () => listActions.current.add());
      expect(state.current.dirty).toBe(true);

      await act(async () =>
        fieldActions.current.setValue([{ age: 42 }, { age: 84 }]),
      );
      expect(state.current.dirty).toBe(false);
    });
  });

  describe("scoped name of list fields", () => {
    const useFieldName = (fieldAtom: FieldAtom<any>) =>
      useAtomValue(useAtomValue(fieldAtom).name);

    it("field name contains list name, index and field name", async () => {
      const field = listAtom({
        name: "contacts",
        value: [{ email: "foo@bar.com" }, { email: "fizz@buzz.com" }],
        fields: ({ email }) => ({
          email: fieldAtom<string>({ value: email, name: "email" }),
        }),
      });

      const { result: list } = renderHook(() => useList(field));
      const { result: names } = renderHook(() => [
        useFieldName(list.current.items[0]!.fields.email),
        useFieldName(list.current.items[1]!.fields.email),
      ]);

      await waitFor(() => Promise.resolve());

      expect(names.current).toEqual(["contacts[0].email", "contacts[1].email"]);
    });

    describe("nested listAtom", () => {
      // passes but throws error
      it("has prefix of the parent listAtom", async () => {
        const field = listAtom({
          name: "contacts",
          value: [
            {
              email: "foo@bar.com",
              addresses: [{ type: "home", city: "Kezmarok" }],
            },
            {
              email: "fizz@buzz.com",
              addresses: [
                { type: "home", city: "Humenne" },
                { type: "work", city: "Nove Zamky" },
              ],
            },
          ],
          fields: ({ email, addresses = [] }) => ({
            email: fieldAtom({ value: email, name: "email" }),
            addresses: listAtom({
              name: "addresses",
              value: addresses,
              fields: ({ type, city }) => ({
                type: fieldAtom({ value: type, name: "type" }),
                city: fieldAtom({ value: city, name: "city" }),
              }),
            }),
          }),
        });

        const { result: list } = renderHook(() => useList(field));
        const { result: secondContactAddresses } = renderHook(() =>
          useList(list.current.items[1]!.fields.addresses),
        );

        const { result: names } = renderHook(() => [
          useFieldName(secondContactAddresses.current.items[0]!.fields.type),
          useFieldName(secondContactAddresses.current.items[0]!.fields.city),
          useFieldName(secondContactAddresses.current.items[1]!.fields.type),
          useFieldName(secondContactAddresses.current.items[1]!.fields.city),
        ]);

        await waitFor(() => Promise.resolve());

        expect(names.current).toEqual([
          "contacts[1].addresses[0].type",
          "contacts[1].addresses[0].city",
          "contacts[1].addresses[1].type",
          "contacts[1].addresses[1].city",
        ]);
      });
    });
  });
});
