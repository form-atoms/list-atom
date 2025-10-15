import { act, renderHook } from "@testing-library/react";
import { fieldAtom, useFieldState } from "form-atoms";
import { describe, expect, it } from "vitest";

import { useFieldInitialValue } from "./useFieldInitialValue";
import { listAtom } from "../../atoms";
import { useListActions } from "../use-list-actions";

describe("useFieldInitialValue()", () => {
  it("reinitializes the field value", async () => {
    const field = listAtom({
      fields: () => ({ age: fieldAtom({ value: 0 }) }),
    });

    const { result: state } = renderHook(() => useFieldState(field));
    const { rerender } = renderHook(
      (props) => useFieldInitialValue(field, props.initialValue),
      { initialProps: { initialValue: [{ age: 1 }, { age: 2 }] } },
    );

    // make list dirty
    const { result: listActions } = renderHook(() => useListActions(field));
    await act(async () => listActions.current.add());
    expect(state.current.dirty).toBe(true);

    const initialValue = [{ age: 21 }, { age: 42 }];

    // initialization makes field pristine
    rerender({ initialValue });
    expect(state.current.dirty).toBe(false);

    // make list dirty again
    await act(async () => listActions.current.add());
    expect(state.current.dirty).toBe(true);

    // re-inititialation skipped with the same initialValue (useEffect dependency)
    rerender({ initialValue });
    expect(state.current.dirty).toBe(true);
  });
});
