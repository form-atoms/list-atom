import { render, screen } from "@testing-library/react";
import { fieldAtom } from "form-atoms";
import { describe, expect, it } from "vitest";
import { listAtom } from "../atoms";
import { createEmpty } from "./empty";

describe("<Empty /> component", () => {
  describe("when there are no items in the list", () => {
    const friends = listAtom({
      fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
    });

    const { Empty } = createEmpty(friends);

    it("renders children", () => {
      render(<Empty>No frens</Empty>);

      expect(screen.queryByText("No frens")).toBeInTheDocument();
    });
  });

  describe("when the list has one or more items", () => {
    const friends = listAtom({
      value: [{ name: "Bobette" }],
      fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
    });

    const { Empty } = createEmpty(friends);

    it("renders nothing", () => {
      render(<Empty>empty message</Empty>);

      expect(screen.queryByText("empty message")).not.toBeInTheDocument();
    });
  });

  describe("when children is a render prop", () => {
    it("passes isEmpty and count to the render prop when the list is empty", () => {
      const friends = listAtom({
        fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
      });

      const { Empty } = createEmpty(friends);

      render(
        <Empty>
          {({ isEmpty, count }) => (
            <p>
              isEmpty: {String(isEmpty)}, count: {count}
            </p>
          )}
        </Empty>,
      );

      expect(screen.getByText("isEmpty: true, count: 0")).toBeInTheDocument();
    });

    it("passes isEmpty and count to the render prop when the list has items", () => {
      const friends = listAtom({
        value: [{ name: "Bobette" }, { name: "Alice" }],
        fields: () => ({ name: fieldAtom<string>({ value: "" }) }),
      });

      const { Empty } = createEmpty(friends);

      render(
        <Empty>
          {({ isEmpty, count }) => (
            <p>
              isEmpty: {String(isEmpty)}, count: {count}
            </p>
          )}
        </Empty>,
      );

      expect(screen.getByText("isEmpty: false, count: 2")).toBeInTheDocument();
    });
  });
});
