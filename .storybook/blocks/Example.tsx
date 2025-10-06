import { type PropsWithChildren } from "react";
import { Story, Markdown } from "@storybook/addon-docs/blocks";
import type { ModuleExport } from "storybook/internal/types";
import { StoryTitle } from "./StoryTitle";

export const Example = ({
  of,
  children,
}: PropsWithChildren<{ of: ModuleExport }>) => {
  const { description } = of.parameters.docs;

  return (
    <>
      <StoryTitle of={of} />
      <Markdown
        options={{
          overrides: { code: ({ children }) => <code>{children}</code> },
        }}
      >
        {description.story}
      </Markdown>
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
