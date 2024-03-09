import React from "react";
import { Title } from "@storybook/blocks";
import { useOf } from "@storybook/blocks";
import type { ModuleExport } from "@storybook/types";

export const StoryTitle = ({ of }: { of: ModuleExport }) => {
  const resolvedOf = useOf(of || "story", ["story", "meta"]);
  switch (resolvedOf.type) {
    case "story": {
      return <h3>{resolvedOf.story.name}</h3>;
    }
    case "meta": {
      return <h3>{resolvedOf.preparedMeta.title}</h3>;
    }
  }
};
