import { fieldAtom } from "form-atoms";
import { describe, expect, it } from "vitest";
import { listAtom } from "../atoms";
import { createList } from "./index";

describe("createList()", () => {
  it("composes the compound components pattern", () => {
    const atom = listAtom({
      fields: () => ({ field: fieldAtom({ value: "" }) }),
    });

    const result = createList(atom);

    expect(result.List).toBeDefined();
    expect(result.List.Add).toBeDefined();
    expect(result.List.Empty).toBeDefined();
    expect(result.List.Item).toBeDefined();
    expect(result.List.Of).toBeDefined();
    expect(result.List.Nested).toBeDefined(); // deprecated
  });
});
