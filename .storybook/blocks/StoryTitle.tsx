import React from "react";
import { Markdown, useOf } from "@storybook/addon-docs/blocks";
import type { ModuleExport } from "storybook/internal/types";

export const StoryTitle = ({ of }: { of: ModuleExport }) => {
  const resolvedOf = useOf(of || "story", ["story", "meta"]);
  switch (resolvedOf.type) {
    case "story": {
      return <Markdown>{`### ${resolvedOf.story.name}`}</Markdown>;
    }
  }

  return <></>;
};
