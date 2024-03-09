import React from "react";
import { Markdown, useOf } from "@storybook/blocks";
import type { ModuleExport } from "@storybook/types";

export const StoryTitle = ({ of }: { of: ModuleExport }) => {
  const resolvedOf = useOf(of || "story", ["story", "meta"]);
  switch (resolvedOf.type) {
    case "story": {
      return <Markdown>{`### ${resolvedOf.story.name}`}</Markdown>;
    }
  }

  return <></>;
};
