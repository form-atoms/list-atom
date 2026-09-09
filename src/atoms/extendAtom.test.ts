import { act, renderHook } from "@testing-library/react";
import { fieldAtom } from "form-atoms";
import { useAtom } from "jotai";
import { describe, expect, it } from "vitest";
import { extendAtom } from "./extendAtom";

describe("extendAtom()", () => {
  const field = extendAtom(fieldAtom({ value: "" }), () => ({
    one: "one",
  }));

  it("can set the extended field", () => {
    const { result } = renderHook(() => useAtom(field));

    act(() => {
      const [field, setField] = result.current;
      // @ts-expect-error fine
      setField({ ...field, two: "two" });
    });

    expect(result.current[0].one).toBe("one");
    // @ts-expect-error fine
    expect(result.current[0].two).toBe("two");
  });
});
