import { render, screen } from "@testing-library/react";
import { fieldAtom } from "form-atoms";
import { describe, expect, it } from "vitest";

import { createEmpty } from "./empty";
import { listAtom } from "../atoms";

describe("<Empty /> component", () => {
  describe("when there are no items in the list", () => {
    const friends = listAtom({
      value: [],
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
});
