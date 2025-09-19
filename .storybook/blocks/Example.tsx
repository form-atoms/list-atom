import React, { PropsWithChildren } from "react";
import { Story, Description } from "@storybook/addon-docs/blocks";
import type { ModuleExport } from "storybook/internal/types";
import { StoryTitle } from "./StoryTitle";

export const Example = ({
  of,
  children,
}: PropsWithChildren<{ of: ModuleExport }>) => {
  return (
    <>
      <StoryTitle of={of} />
      <Description of={of} />
      <article>
        <Story of={of} />
        <footer>
          <details className="code-details">
            <summary>Show code</summary>
            {children}
          </details>
        </footer>
      </article>
    </>
  );
};
