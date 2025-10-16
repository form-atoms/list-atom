import { act, renderHook, waitFor } from "@testing-library/react";
import {
  fieldAtom,
  formAtom,
  useFieldActions,
  useFieldErrors,
  useFieldState,
  useFieldValue,
  useFormActions,
  useFormErrors,
  useFormSubmit,
} from "form-atoms";
import { useAtomValue } from "jotai";
import { describe, expect, it, test, vi } from "vitest";

import { listAtom } from "./listAtom";
import { useList, useListActions } from "../../hooks";
import { useFieldName } from "../../hooks/useFieldName";
import { extendAtom } from "../extendAtom";

describe("listAtom()", () => {
  test("can be submitted within formAtom", async () => {
    const nums = listAtom({
      value: [{ age: 20 }, { age: 30 }],
      fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
    });

    const form = formAtom({ nums });

    // mounts effect
    renderHook(() => useFieldValue(nums));
    const { result: submit } = renderHook(() => useFormSubmit(form));

    const onSubmit = vi.fn();

    await act(async () => submit.current(onSubmit)());

    expect(onSubmit).toHaveBeenCalledWith({ nums: [{ age: 20 }, { age: 30 }] });
  });

  describe("empty atom", () => {
    it("is true when values is empty array", () => {
      const list = listAtom({
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
      });

      const { result } = renderHook(() =>
        useAtomValue(useAtomValue(list).empty),
      );

      expect(result.current).toBe(true);
    });

    it("is false when value contain data", () => {
      const list = listAtom({
        value: [{ age: 3 }],
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
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
      fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
    });

    const { result } = renderHook(() => useFieldValue(list));

    expect(result.current).toEqual([{ age: 80 }, { age: 70 }]);
  });

  describe("useFieldActions(listAtom).setValue", () => {
    test("works with array value", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
      });

      const { result: fieldActions } = renderHook(() => useFieldActions(ages));

      await act(async () =>
        fieldActions.current.setValue([{ age: 20 }, { age: 40 }]),
      );

      const { result } = renderHook(() => useFieldValue(ages));

      expect(result.current).toEqual([{ age: 20 }, { age: 40 }]);
    });

    test("works with a callback function", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
      });

      const { result: fieldActions } = renderHook(() => useFieldActions(ages));

      // mounts effect
      renderHook(() => useFieldValue(ages));

      await act(async () =>
        fieldActions.current.setValue((ages) => [...ages, { age: 30 }]),
      );

      const { result } = renderHook(() => useFieldValue(ages));

      expect(result.current).toEqual([{ age: 10 }, { age: 30 }]);
    });

    test("throws for non-array value", async () => {
      const ages = listAtom({
        value: [{ age: 10 }],
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
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
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
      });
      const form = formAtom({ ages });

      // mounts effect
      renderHook(() => useFieldValue(ages));
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
        fields: () => ({ age: fieldAtom<number>({ value: 0 }) }),
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
        fields: () => ({ email: fieldAtom<string>({ value: "" }) }),
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
        fields: () => ({
          email: fieldAtom<string | undefined>({
            value: "",
            validate: ({ value }) => (value ? [] : ["required"]),
          }),
        }),
      });

      const { result: actions } = renderHook(() => useFieldActions(field));
      const { result: errors } = renderHook(() => useFieldErrors(field));

      await act(async () => actions.current.validate());

      expect(errors.current).toEqual(["err"]);
    });

    it("runs asynchronous validation", async () => {
      async function hasAdminEmail(emails: string[]) {
        return emails.includes("admin@form-atoms.com");
      }

      const field = listAtom({
        value: [{ email: "foo" }],
        fields: () => ({
          email: fieldAtom({ value: "" }),
        }),
        validate: async ({ value }) =>
          (await hasAdminEmail(value.map((value) => value.email)))
            ? []
            : ["missing admin email"],
      });

      const { result: actions } = renderHook(() => useFieldActions(field));
      const { result: errors } = renderHook(() => useFieldErrors(field));

      await act(async () => actions.current.validate());

      expect(errors.current).toEqual(["missing admin email"]);
    });

    describe("when form validated", () => {
      it("runs asynchronous validation", async () => {
        async function hasAdminEmail(emails: string[]) {
          return emails.includes("admin@form-atoms.com");
        }

        const form = formAtom({
          emails: listAtom({
            value: [{ email: "admin@form-atoms" }],
            fields: () => ({
              email: fieldAtom({ value: "" }),
            }),
            validate: async ({ value }) =>
              (await hasAdminEmail(value.map((value) => value.email)))
                ? []
                : ["missing admin email"],
          }),
        });

        const { result: actions } = renderHook(() => useFormActions(form));

        await act(async () => actions.current.validate());

        const { result: errors } = renderHook(() => useFormErrors(form));
        expect(errors.current).toEqual({ emails: ["missing admin email"] });
      });
    });
  });

  describe("nested validation", () => {
    it("can't be submitted with invalid item's field", async () => {
      const field = listAtom({
        value: [{ age: undefined }],
        fields: () => ({
          age: fieldAtom<number | undefined>({
            value: 0,
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
        fields: () => ({
          accounts: listAtom({
            name: "bank-accounts",
            fields: () => ({
              iban: fieldAtom<string | undefined>({
                name: "iban",
                value: undefined,
                validate: ({ value }) => (value ? [] : ["required"]),
              }),
            }),
          }),
        }),
      });

      // mounts effect
      renderHook(() => useFieldValue(field));

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
        fields: () => ({
          age: fieldAtom<number | undefined>({
            value: 0,
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
        fields: () => ({
          age: fieldAtom<number | undefined>({
            value: 0,
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
        fields: () => ({
          age: fieldAtom<number>({ value: 0 }),
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
        fields: () => ({
          age: fieldAtom<number>({ value: 0 }),
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
        fields: () => ({
          age: fieldAtom<number>({ value: 3 }),
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
        fields: () => ({
          age: fieldAtom<number>({ value: 0 }),
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
        fields: () => ({
          age: fieldAtom<number>({ value: 0 }),
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
        fields: () => ({
          age: fieldAtom<number>({ value: 0 }),
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
    it("works with extended fieldAtom (bugfix: infinite loop by patchNameEffect dependencies)", async () => {
      const extendedField = () =>
        extendAtom(fieldAtom({ value: "" }), () => ({ some: "value" }));

      const field = listAtom({
        name: "list",
        value: [{ field: "" }],
        fields: () => ({
          field: extendedField(),
        }),
      });

      const { result: list } = renderHook(() => useList(field));
      const { result: name } = renderHook(() =>
        useFieldName(list.current.items[0]!.fields.field),
      );

      await waitFor(() => Promise.resolve());

      expect(name.current).toEqual("list[0].field");
    });

    it("field name contains list name, index and field name", async () => {
      const field = listAtom({
        name: "contacts",
        value: [{ email: "foo@bar.com" }, { email: "fizz@buzz.com" }],
        fields: () => ({
          email: fieldAtom<string>({ value: "", name: "email" }),
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

    it("works with intermediary plain objects", () => {
      const field = listAtom({
        name: "cities",
        value: [
          { cityHall: { street: "okruzna", location: { lat: 7, lng: 11 } } },
        ],
        fields: () => ({
          cityHall: {
            street: fieldAtom({ name: "street", value: "" }),
            location: {
              lat: fieldAtom({ value: 0 }),
              // NOTE: explicit name takes precedence over the field key
              lng: fieldAtom({ name: "longitude", value: 0 }),
            },
          },
        }),
      });

      const { result: list } = renderHook(() => useList(field));

      const { result: lat } = renderHook(() =>
        useFieldName(list.current.items[0]!.fields.cityHall.location.lat),
      );
      expect(lat.current).toEqual("cities[0].cityHall.location.lat");

      const { result: lng } = renderHook(() =>
        useFieldName(list.current.items[0]!.fields.cityHall.location.lng),
      );
      expect(lng.current).toEqual("cities[0].cityHall.location.longitude");
    });

    describe("nested listAtom", () => {
      it("has prefix of the parent listAtom", async () => {
        const field = listAtom({
          name: "contacts",
          value: [
            {
              email: "foo@bar.com",
              addresses: [{ location: { latLng: "7;11" }, city: "Kezmarok" }],
            },
            {
              email: "fizz@buzz.com",
              addresses: [
                { location: { latLng: "7;11" }, city: "Humenne" },
                { location: { latLng: "7;11" }, city: "Nove Zamky" },
              ],
            },
          ],
          fields: () => ({
            email: fieldAtom({ value: "", name: "email" }),
            addresses: listAtom({
              name: "addresses",
              fields: () => ({
                location: {
                  latLng: fieldAtom({ value: "" }),
                },
                city: fieldAtom({ value: "", name: "city" }),
              }),
            }),
          }),
        });

        const { result: list } = renderHook(() => useList(field));
        const { result: secondContactAddresses } = renderHook(() =>
          useList(list.current.items[1]!.fields.addresses),
        );

        const { result: names } = renderHook(() => [
          useFieldName(
            secondContactAddresses.current.items[0]!.fields.location.latLng,
          ),
          useFieldName(secondContactAddresses.current.items[0]!.fields.city),
          useFieldName(
            secondContactAddresses.current.items[1]!.fields.location.latLng,
          ),
          useFieldName(secondContactAddresses.current.items[1]!.fields.city),
        ]);

        expect(names.current).toEqual([
          "contacts[1].addresses[0].location.latLng",
          "contacts[1].addresses[0].city",
          "contacts[1].addresses[1].location.latLng",
          "contacts[1].addresses[1].city",
        ]);
      });
    });
  });
});
