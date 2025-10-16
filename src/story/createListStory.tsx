import { type StoryObj } from "@storybook/react-vite";
import { type FormFields } from "form-atoms";

import { StoryForm } from "./StoryForm";
import { type ListAtom, type ListComponents, createList } from "../";

export function render<Fields extends FormFields>({
  atom,
  children,
}: ListStoryArgs<Fields>) {
  const { List } = createList(atom);

  return children({ List, atom });
}

type ListStoryArgs<Fields extends FormFields> = {
  hideFormActions?: boolean;
  atom: ListAtom<Fields>;
  children: (
    props: ListComponents<Fields> & {
      atom: ListAtom<Fields>;
    },
  ) => React.ReactNode;
};

export const createListStory = <Fields extends FormFields>(
  storyObj: {
    args: ListStoryArgs<Fields>;
  } & Omit<StoryObj, "args">,
) => ({
  decorators: [
    (Story: () => JSX.Element) => (
      <StoryForm
        fields={{ field: storyObj.args.atom }}
        hideFormActions={storyObj.args.hideFormActions}
      >
        {() => <Story />}
      </StoryForm>
    ),
  ],
  ...storyObj,
});

export const RemoveButton = ({ remove }: { remove: () => void }) => (
  <button type="button" className="outline secondary" onClick={remove}>
    Remove
  </button>
);
